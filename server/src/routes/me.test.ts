/**
 * Unit tests for GET /api/v1/me
 * Uses the test verifier injection to mock Clerk JWT verification.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { meRouter } from './me.js';
import { errorHandler } from '../middleware/error.js';
import { _setVerifierForTest } from '../middleware/auth.js';

function buildApp(): express.Application {
  const app = express();
  app.use(express.json());
  app.use(meRouter);
  app.use(errorHandler);
  return app;
}

const validUser = {
  sub: 'user_2abc123XYZ',
  email_address: 'coach@example.com',
  first_name: 'Jordan',
  last_name: 'Smith',
  image_url: 'https://img.clerk.com/abc.jpg',
};

describe('GET /api/v1/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    _setVerifierForTest(null);
  });

  it('returns 200 with AuthUser when a valid token is provided', async () => {
    _setVerifierForTest(async () => validUser);

    const res = await request(buildApp())
      .get('/api/v1/me')
      .set('Authorization', 'Bearer valid-token-123');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      data: {
        clerkUserId: 'user_2abc123XYZ',
        email: 'coach@example.com',
        firstName: 'Jordan',
        lastName: 'Smith',
        imageUrl: 'https://img.clerk.com/abc.jpg',
      },
    });
  });

  it('returns 401 RFC 7807 when no Authorization header is provided', async () => {
    const res = await request(buildApp()).get('/api/v1/me');

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      type: 'about:blank',
      title: 'Unauthorized',
      status: 401,
      detail: expect.stringContaining('Bearer token is missing'),
    });
  });

  it('returns 401 RFC 7807 when an invalid token is provided', async () => {
    _setVerifierForTest(async () => {
      throw new Error('JWT verification failed: expired');
    });

    const res = await request(buildApp())
      .get('/api/v1/me')
      .set('Authorization', 'Bearer expired-token');

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      type: 'about:blank',
      title: 'Unauthorized',
      status: 401,
      detail: expect.stringContaining('invalid or has expired'),
    });
  });

  it('returns 401 when Authorization header is malformed (no Bearer prefix)', async () => {
    const res = await request(buildApp())
      .get('/api/v1/me')
      .set('Authorization', 'Basic abc123');

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(401);
  });
});
