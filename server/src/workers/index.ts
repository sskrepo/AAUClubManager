/**
 * Worker boot file. Starts all BullMQ workers.
 * Runs as a separate process from the API server.
 *
 * Usage:
 *   npm run dev:workers    (development, with nodemon)
 *   node dist/workers/index.js  (production)
 */

import 'dotenv/config';
import { startHelloWorker } from './hello.worker.js';
import { startNotificationWorker } from './notification.worker.js';
import { logger } from '../lib/logger.js';

async function startWorkers(): Promise<void> {
  logger.info('Starting BullMQ workers...');

  const helloWorker = startHelloWorker();
  const notificationWorker = startNotificationWorker();

  logger.info('All workers started');

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutting down workers...');
    await Promise.all([helloWorker.close(), notificationWorker.close()]);
    logger.info('All workers shut down');
    process.exit(0);
  };

  process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
  process.on('SIGINT', () => { void shutdown('SIGINT'); });
}

startWorkers().catch((err: unknown) => {
  console.error('Fatal worker startup error:', err);
  process.exit(1);
});
