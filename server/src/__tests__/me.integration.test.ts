/**
 * Integration test stubs for GET /api/v1/me.
 * Deferred to Wave 3 — requires a real Clerk JWT (can use test token from Clerk dashboard).
 *
 * Phase 0 exit: stubs exist. Wave 3: implement with real Clerk JWT.
 */

import { describe, it } from 'vitest';

describe('GET /api/v1/me (integration)', () => {
  it.todo('returns 200 with AuthUser when a valid Clerk JWT is provided');
  it.todo('returns 401 when no token is provided');
  it.todo('returns 401 when an expired token is provided');
});
