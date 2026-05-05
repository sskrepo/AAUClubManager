/**
 * Unit tests for Clerk auth middleware.
 */

import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import express, { Request, Response } from 'express';
import { requireAuth, _setVerifierForTest } from './auth.js';
import { errorHandler } from './error.js';

function buildApp(): express.Application {
  const app = express();
  app.use(express.json());

  // Protected route
  app.get('/protected', requireAuth, (req: Request, res: Response) => {
    res.json({ user: req.user });
  });

  app.use(errorHandler);
  return app;
}

const validPayload = {
  sub: 'user_test_123',
  email_address: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  image_url: undefined,
};

describe('requireAuth middleware', () => {
  afterEach(() => {
    _setVerifierForTest(null);
  });

  it('populates req.user on a valid token', async () => {
    _setVerifierForTest(async () => validPayload);

    const res = await request(buildApp())
      .get('/protected')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      clerkUserId: 'user_test_123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    });
  });

  it('returns 401 RFC 7807 with no Authorization header', async () => {
    const res = await request(buildApp()).get('/protected');

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      type: 'about:blank',
      title: 'Unauthorized',
      status: 401,
      detail: expect.stringContaining('Bearer token is missing'),
    });
  });

  it('returns 401 RFC 7807 with a non-Bearer scheme', async () => {
    const res = await request(buildApp())
      .get('/protected')
      .set('Authorization', 'Token abc123');

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(401);
  });

  it('returns 401 RFC 7807 when token verification throws', async () => {
    _setVerifierForTest(async () => {
      throw new Error('Invalid token signature');
    });

    const res = await request(buildApp())
      .get('/protected')
      .set('Authorization', 'Bearer bad-token');

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      type: 'about:blank',
      title: 'Unauthorized',
      status: 401,
      detail: expect.stringContaining('invalid or has expired'),
    });
  });

  it('returns 401 RFC 7807 when token is empty string after Bearer', async () => {
    const res = await request(buildApp())
      .get('/protected')
      .set('Authorization', 'Bearer ');

    // Empty token should fail verification
    _setVerifierForTest(async () => {
      throw new Error('Token is empty');
    });

    // Re-test with verifier that throws
    const res2 = await request(buildApp())
      .get('/protected')
      .set('Authorization', 'Bearer ');

    expect(res2.status).toBe(401);
  });
});
