/**
 * Clerk JWT auth middleware.
 * Populates req.user on success; returns 401 RFC 7807 on failure.
 * Mount on routes that require authentication (not /health).
 *
 * Uses @clerk/backend verifyToken (successor to deprecated @clerk/clerk-sdk-node).
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken as clerkVerifyToken } from '@clerk/backend';
import { config } from '../config/index.js';
import { logger } from '../lib/logger.js';
import { UnauthorizedError } from './error.js';

// Token payload shape returned by Clerk's verifyToken
interface ClerkTokenPayload {
  sub: string;
  email_address?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
}

// Allow injection of a mock verifier in tests
type TokenVerifier = (token: string) => Promise<ClerkTokenPayload>;

let _verifier: TokenVerifier | null = null;

export function _setVerifierForTest(verifier: TokenVerifier | null): void {
  _verifier = verifier;
}

async function verifyToken(token: string): Promise<ClerkTokenPayload> {
  if (_verifier) {
    return _verifier(token);
  }

  const secretKey = config.clerkSecretKey;
  if (!secretKey) {
    throw new Error('CLERK_SECRET_KEY is required for auth middleware');
  }

  // @clerk/backend verifyToken validates signature, expiry, and issuer
  const payload = await clerkVerifyToken(token, { secretKey });

  return {
    sub: payload.sub,
    email_address: (payload as Record<string, unknown>)['email_address'] as string | undefined,
    first_name: (payload as Record<string, unknown>)['first_name'] as string | undefined,
    last_name: (payload as Record<string, unknown>)['last_name'] as string | undefined,
    image_url: (payload as Record<string, unknown>)['image_url'] as string | undefined,
  };
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new UnauthorizedError('Bearer token is missing. Include Authorization: Bearer <token>'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyToken(token);

    req.user = {
      clerkUserId: payload.sub,
      email: payload.email_address ?? '',
      firstName: payload.first_name,
      lastName: payload.last_name,
      imageUrl: payload.image_url,
    };

    logger.debug({ clerkUserId: payload.sub }, 'Auth: token validated');
    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.debug({ message }, 'Auth: token validation failed');
    next(new UnauthorizedError('Bearer token is invalid or has expired. Refresh and retry.'));
  }
}
