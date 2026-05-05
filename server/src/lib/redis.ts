import Redis from 'ioredis';
import { config } from '../config/index.js';
import { logger } from './logger.js';

let redisClient: Redis | null = null;

export function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis(config.redisUrl ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: null, // Required by BullMQ
      lazyConnect: true,
      enableReadyCheck: false,
    });

    redisClient.on('error', (err: Error) => {
      logger.error({ err }, 'Redis connection error');
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected');
    });
  }
  return redisClient;
}

export async function pingRedis(): Promise<boolean> {
  try {
    const client = getRedis();
    const result = await client.ping();
    return result === 'PONG';
  } catch (err: unknown) {
    logger.debug({ err }, 'Redis ping failed');
    return false;
  }
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
