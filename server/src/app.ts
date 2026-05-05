/**
 * Express app factory. Does NOT call app.listen.
 * Import and call app.listen only in server.ts.
 * Tests import this directly.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import * as OpenApiValidator from 'express-openapi-validator';
import path from 'path';
import { logger } from './lib/logger.js';
import { healthRouter } from './routes/health.js';
import { meRouter } from './routes/me.js';
import { errorHandler } from './middleware/error.js';

export function createApp(): express.Application {
  const app = express();

  // 1. CORS
  app.use(cors());

  // 2. Request ID injection
  app.use((req: Request, _res: Response, next: NextFunction) => {
    req.requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    next();
  });

  // 3. Request logger (Pino)
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({
        requestId: (req as Request & { requestId?: string }).requestId,
      }),
      quietReqLogger: true,
    })
  );

  // 4. JSON body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 5. OpenAPI request/response validator
  // Resolves the spec from the project root (two levels up from server/src/)
  const specPath = path.resolve(__dirname, '../../api/openapi.yaml');
  const isDev = process.env['NODE_ENV'] !== 'production';

  app.use(
    OpenApiValidator.middleware({
      apiSpec: specPath,
      validateRequests: true,
      validateResponses: isDev, // Only validate responses in dev
      validateSecurity: false, // We handle auth ourselves in middleware
    })
  );

  // 6. Idempotency-key slot — no-op placeholder for Phase 5 (Payments)
  // When activated, this middleware will intercept POST/PATCH requests
  // with an Idempotency-Key header and return cached responses for duplicates.
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    // Phase 5: implement idempotency key lookup and caching here
    next();
  });

  // 7. Routes
  app.use(healthRouter);
  app.use(meRouter);

  // 8. 404 handler for unmatched routes
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    const err = Object.assign(new Error('Not Found'), { status: 404, errors: [] });
    next(err);
  });

  // 9. OpenAPI validator error handler (must come before generic error handler)
  // express-openapi-validator errors are caught by the generic error handler
  // which knows how to detect and format them.

  // 10. Generic RFC 7807 error handler (must be last)
  app.use(errorHandler);

  return app;
}
