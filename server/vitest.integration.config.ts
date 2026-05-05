import { defineConfig } from 'vitest/config';

/**
 * Integration test configuration.
 * Requires:
 *   DATABASE_URL — real Postgres DB (Docker: postgres://postgres:postgres@localhost:5432/aauclub_test)
 *   REDIS_URL — real Redis (Docker: redis://localhost:6379)
 *
 * Usage: npm run test:integration
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.integration.test.ts'],
    testTimeout: 30000, // 30s for DB operations
    hookTimeout: 30000,
    globalSetup: [],
  },
});
