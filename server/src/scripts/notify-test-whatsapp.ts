/**
 * Dev script: enqueues a test WhatsApp notification job.
 * Usage: npm run notify:test:whatsapp (from server/)
 *
 * Requires:
 *   TEST_WHATSAPP_NUMBER env var — recipient number (E.164 format, e.g. +15551234567)
 *   DIALOG360_API_KEY + DIALOG360_BASE_URL — for worker to deliver
 *   REDIS_URL — Redis connection
 *
 * Sandbox limits:
 *   - Can only send to YOUR OWN WhatsApp number (the one you used to get the sandbox key)
 *   - 200 message cap total
 *   - Templates available: disclaimer, first_welcome_messsage, interactive_template_sandbox
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
  const toNumber = config.testWhatsappNumber;
  if (!toNumber) {
    console.error('TEST_WHATSAPP_NUMBER env var is required. Set it in .env or server/.env');
    console.error('Format: E.164, e.g. +15551234567');
    process.exit(1);
  }

  const connection = getRedis();
  const queue = new Queue<NotificationPayload>('send-notification', { connection });

  const payload: NotificationPayload = {
    channel: 'whatsapp',
    to: toNumber,
    body: 'AAUClubManager Phase 0 Test — WhatsApp notification service works.',
  };

  const job = await queue.add('notify-whatsapp-test', payload);
  logger.info({ jobId: job.id, to: toNumber }, 'Enqueued WhatsApp notification job');
  console.log(`WhatsApp notification job enqueued: ${job.id}`);
  console.log(`Sending to: ${toNumber}`);
  console.log(`Base URL: ${config.dialog360BaseUrl}`);
  console.log('Start the worker (npm run dev:workers) to process delivery.');

  await queue.close();
  await connection.quit();
  process.exit(0);
}

main().catch((err: unknown) => {
  console.error('notify-test-whatsapp failed:', err);
  process.exit(1);
});
