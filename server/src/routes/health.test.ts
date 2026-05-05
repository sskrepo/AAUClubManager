/**
 * Unit tests for GET /health
 * Mocks DB and Redis — no real connections needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { healthRouter } from './health.js';
import { errorHandler } from '../middleware/error.js';

// Mock lib/db and lib/redis at module boundary
vi.mock('../lib/db.js', () => ({
  db: {
    raw: vi.fn(),
  },
}));

vi.mock('../lib/redis.js', () => ({
  pingRedis: vi.fn(),
}));

import { db } from '../lib/db.js';
import { pingRedis } from '../lib/redis.js';

function buildApp(): express.Application {
  const app = express();
  app.use(express.json());
  app.use(healthRouter);
  app.use(errorHandler);
  return app;
}

describe('GET /health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with status ok when DB and Redis are healthy', async () => {
    vi.mocked(db.raw).mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
    vi.mocked(pingRedis).mockResolvedValueOnce(true);

    const res = await request(buildApp()).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      timestamp: expect.any(String),
      version: expect.any(String),
    });
    // No subsystems detail in happy path
    expect(res.body.subsystems).toBeUndefined();
  });

  it('returns 200 with status degraded when DB is unreachable', async () => {
    vi.mocked(db.raw).mockRejectedValueOnce(new Error('connection refused'));
    vi.mocked(pingRedis).mockResolvedValueOnce(true);

    const res = await request(buildApp()).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'degraded',
      subsystems: {
        db: 'error',
        redis: 'ok',
      },
    });
  });

  it('returns 200 with status degraded when Redis is unreachable', async () => {
    vi.mocked(db.raw).mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
    vi.mocked(pingRedis).mockResolvedValueOnce(false);

    const res = await request(buildApp()).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'degraded',
      subsystems: {
        db: 'ok',
        redis: 'error',
      },
    });
  });

  it('returns 200 with degraded when both DB and Redis are unreachable', async () => {
    vi.mocked(db.raw).mockRejectedValueOnce(new Error('timeout'));
    vi.mocked(pingRedis).mockResolvedValueOnce(false);

    const res = await request(buildApp()).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'degraded',
      subsystems: {
        db: 'error',
        redis: 'error',
      },
    });
  });

  it('response includes a valid ISO 8601 timestamp', async () => {
    vi.mocked(db.raw).mockResolvedValueOnce({ rows: [] });
    vi.mocked(pingRedis).mockResolvedValueOnce(true);

    const res = await request(buildApp()).get('/health');

    const ts = new Date(res.body.timestamp as string);
    expect(ts.toISOString()).toBe(res.body.timestamp);
  });
});
