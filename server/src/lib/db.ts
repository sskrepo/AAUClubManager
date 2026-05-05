import Knex from 'knex';
import { config } from '../config/index.js';
import { logger } from './logger.js';

function createKnex(): ReturnType<typeof Knex> {
  const databaseUrl = config.databaseUrl;

  if (!databaseUrl) {
    // In unit test environment without a real DB, return a minimal mock.
    // Integration tests must set DATABASE_URL.
    logger.warn('DATABASE_URL not set — DB health check will report degraded.');
    // Return a knex instance pointing at nothing; queries will fail gracefully.
    return Knex({
      client: 'pg',
      connection: 'postgres://localhost/dev_stub',
      pool: { min: 0, max: 0 },
    });
  }

  return Knex({
    client: 'pg',
    connection: databaseUrl,
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'knex_migrations',
      directory: '../db/migrations',
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
  });
}

export const db = createKnex();
