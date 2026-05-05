/**
 * Integration test stubs for GET /health.
 * Deferred to Wave 3 — requires Docker Postgres + Redis.
 * Config files exist now so `npm run test:integration` runs without error.
 *
 * Phase 0 exit: stubs exist. Wave 3: implement with real DB + Redis.
 */

import { describe, it } from 'vitest';

describe('GET /health (integration)', () => {
  it.todo('returns 200 ok when real DB and Redis are reachable');
  it.todo('returns 200 degraded when DB is unavailable');
  it.todo('returns 200 degraded when Redis is unavailable');
});
