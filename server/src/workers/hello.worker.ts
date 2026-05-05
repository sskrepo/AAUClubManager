/**
 * Hello-world BullMQ worker.
 * Queue: hello-world
 * Processes jobs with { message: string } payload and logs them.
 * Proves the BullMQ + Redis pipeline works independently of notification service.
 */

import { Worker, Job } from 'bullmq';
import { getRedis } from '../lib/redis.js';
import { logger } from '../lib/logger.js';

export interface HelloJobData {
  message: string;
}

export function startHelloWorker(): Worker<HelloJobData> {
  const connection = getRedis();

  const worker = new Worker<HelloJobData>(
    'hello-world',
    async (job: Job<HelloJobData>) => {
      logger.info(
        { jobId: job.id, queue: 'hello-world', message: job.data.message },
        `hello-world job processed: ${job.data.message}`
      );
    },
    { connection }
  );

  worker.on('completed', (job: Job<HelloJobData>) => {
    logger.info({ jobId: job.id }, 'hello-world job completed');
  });

  worker.on('failed', (job: Job<HelloJobData> | undefined, err: Error) => {
    logger.error({ jobId: job?.id, err }, 'hello-world job failed');
  });

  logger.info('[INFO] hello-world worker started');
  return worker;
}
