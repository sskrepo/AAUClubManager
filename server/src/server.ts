/**
 * Server boot file. Loads env, creates app, starts listening.
 * This file is NOT imported by tests — they import app.ts directly.
 */

import 'dotenv/config';
import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './lib/logger.js';

async function main(): Promise<void> {
  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(
      {
        port: config.port,
        env: config.nodeEnv,
        version: config.version,
      },
      'AAUClubManager API server started'
    );
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutdown signal received');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
  process.on('SIGINT', () => { void shutdown('SIGINT'); });
}

main().catch((err: unknown) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
