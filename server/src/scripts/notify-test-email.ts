/**
 * Dev script: enqueues a test email notification job.
 * Usage: npm run notify:test:email (from server/)
 *
 * Requires:
 *   TEST_EMAIL env var — recipient address
 *   RESEND_API_KEY + RESEND_FROM_EMAIL — for worker to deliver
 *   REDIS_URL — Redis connection
 *
 * Run with the worker process active (npm run dev:workers) to see delivery.
 */

import 'dotenv/config';
import { Queue } from 'bullmq';
import { getRedis } from '../lib/redis.js';
import { logger } from '../lib/logger.js';
import { config } from '../config/index.js';
import type { NotificationPayload } from '../services/notification/types.js';

async function main(): Promise<void> {
  const toEmail = config.testEmail;
  if (!toEmail) {
    console.error('TEST_EMAIL env var is required. Set it in .env or server/.env');
    process.exit(1);
  }

  const connection = getRedis();
  const queue = new Queue<NotificationPayload>('send-notification', { connection });

  const payload: NotificationPayload = {
    channel: 'email',
    to: toEmail,
    subject: 'AAUClubManager Phase 0 Test',
    body: 'Notification service works. This email was delivered via Resend from the Phase 0 scaffold.',
  };

  const job = await queue.add('notify-email-test', payload);
  logger.info({ jobId: job.id, to: toEmail }, 'Enqueued email notification job');
  console.log(`Email notification job enqueued: ${job.id}`);
  console.log(`Sending to: ${toEmail}`);
  console.log('Start the worker (npm run dev:workers) to process delivery.');

  await queue.close();
  await connection.quit();
  process.exit(0);
}

main().catch((err: unknown) => {
  console.error('notify-test-email failed:', err);
  process.exit(1);
});
