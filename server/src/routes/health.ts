/**
 * GET /health — liveness + readiness probe.
 * No auth required. Returns 200 for both ok and degraded states.
 * Body discriminates the state.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../lib/db.js';
import { pingRedis } from '../lib/redis.js';
import { config } from '../config/index.js';
import { logger } from '../lib/logger.js';

export const healthRouter = Router();

interface SubsystemStatus {
  db: 'ok' | 'error';
  redis: 'ok' | 'error';
}

healthRouter.get('/health', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [dbOk, redisOk] = await Promise.all([checkDb(), pingRedis()]);

    const subsystems: SubsystemStatus = {
      db: dbOk ? 'ok' : 'error',
      redis: redisOk ? 'ok' : 'error',
    };

    const allOk = dbOk && redisOk;
    const status = allOk ? 'ok' : 'degraded';

    const body: {
      status: 'ok' | 'degraded';
      timestamp: string;
      version: string;
      subsystems?: SubsystemStatus;
    } = {
      status,
      timestamp: new Date().toISOString(),
      version: config.version,
    };

    // Only include subsystem detail when degraded (avoid leaking topology in happy path)
    if (!allOk) {
      body.subsystems = subsystems;
    }

    res.status(200).json(body);
  } catch (err: unknown) {
    logger.error({ err }, 'Health check threw unexpected error');
    next(err);
  }
});

async function checkDb(): Promise<boolean> {
  try {
    await db.raw('SELECT 1');
    return true;
  } catch (err: unknown) {
    logger.debug({ err }, 'DB health check failed');
    return false;
  }
}
