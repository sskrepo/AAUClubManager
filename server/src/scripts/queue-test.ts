/**
 * Dev script: enqueues a hello-world job.
 * Usage: npm run queue:test (from server/)
 *
 * Run with the worker process active (npm run dev:workers) to see the job processed.
 */

import 'dotenv/config';
import { Queue } from 'bullmq';
import { getRedis } from '../lib/redis.js';
import { logger } from '../lib/logger.js';
import type { HelloJobData } from '../workers/hello.worker.js';

async function main(): Promise<void> {
  const connection = getRedis();

  const queue = new Queue<HelloJobData>('hello-world', { connection });

  const job = await queue.add('hello', { message: 'Phase 0 queue test' });
  logger.info({ jobId: job.id, queue: 'hello-world' }, 'Enqueued hello-world job');
  console.log(`Job enqueued: ${job.id}`);

  await queue.close();
  await connection.quit();
  process.exit(0);
}

main().catch((err: unknown) => {
  console.error('queue-test failed:', err);
  process.exit(1);
});
