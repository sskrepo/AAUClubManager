/**
 * Notification BullMQ worker.
 * Queue: send-notification
 * Processes NotificationPayload jobs via NotificationService.
 *
 * On provider error: catches, logs, marks job failed. Does NOT crash the worker process.
 */

import { Worker, Job } from 'bullmq';
import { getRedis } from '../lib/redis.js';
import { logger } from '../lib/logger.js';
import { createNotificationService } from '../services/notification/notification.service.js';
import { NotificationPayload } from '../services/notification/types.js';

export function startNotificationWorker(): Worker<NotificationPayload> {
  const connection = getRedis();
  const notificationService = createNotificationService();

  const worker = new Worker<NotificationPayload>(
    'send-notification',
    async (job: Job<NotificationPayload>) => {
      const start = Date.now();
      logger.info(
        { jobId: job.id, channel: job.data.channel, to: job.data.to },
        'Processing notification job'
      );

      await notificationService.send(job.data);

      logger.info(
        { jobId: job.id, channel: job.data.channel, durationMs: Date.now() - start },
        'Notification job completed'
      );
    },
    {
      connection,
      settings: {
        backoffStrategy: (attemptsMade: number) => {
          // Exponential backoff: 5s, 10s, 20s
          return Math.pow(2, attemptsMade - 1) * 5000;
        },
      },
    }
  );

  worker.on('completed', (job: Job<NotificationPayload>) => {
    logger.info({ jobId: job.id, channel: job.data.channel }, 'Notification job marked completed');
  });

  worker.on('failed', (job: Job<NotificationPayload> | undefined, err: Error) => {
    logger.error(
      { jobId: job?.id, channel: job?.data?.channel, to: job?.data?.to, err },
      'Notification job failed — check provider credentials and connectivity'
    );
    // Do NOT rethrow — let BullMQ mark the job failed and continue processing
  });

  worker.on('error', (err: Error) => {
    logger.error({ err }, 'Notification worker error (non-job error)');
  });

  logger.info('[INFO] notification worker started');
  return worker;
}
