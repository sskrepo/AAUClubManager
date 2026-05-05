/**
 * RFC 7807 problem-details error handler.
 * Must be the last middleware registered in app.ts.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';
import { ConfigurationError } from '../config/index.js';

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Array<{ field: string; message: string; value?: unknown }>;
}

/**
 * Typed application errors. Each maps to a specific HTTP status.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly title: string,
    message: string,
    public readonly type: string = 'about:blank'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(detail: string) {
    super(404, 'Not Found', detail);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(detail: string) {
    super(401, 'Unauthorized', detail);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(detail: string) {
    super(403, 'Forbidden', detail);
    this.name = 'ForbiddenError';
  }
}

export class ValidationAppError extends AppError {
  constructor(
    detail: string,
    public readonly validationErrors?: Array<{ field: string; message: string; value?: unknown }>
  ) {
    super(422, 'Unprocessable Entity', detail);
    this.name = 'ValidationAppError';
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const requestId = req.requestId ?? 'unknown';
  const instance = `${req.path}?reqId=${requestId}`;

  // express-openapi-validator errors
  if (isOpenApiValidatorError(err)) {
    const body: ProblemDetails = {
      type: 'about:blank',
      title: 'Validation Error',
      status: err.status,
      detail: err.message,
      instance,
      errors: err.errors?.map((e: { path: string; message: string; errorCode?: string }) => ({
        field: e.path,
        message: e.message,
      })),
    };
    res.status(err.status).json(body);
    return;
  }

  if (err instanceof AppError) {
    const body: ProblemDetails = {
      type: err.type,
      title: err.title,
      status: err.statusCode,
      detail: err.message,
      instance,
    };
    if (err instanceof ValidationAppError && err.validationErrors) {
      body.errors = err.validationErrors;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ConfigurationError) {
    logger.error({ err }, 'ConfigurationError surfaced to HTTP — check env vars');
    res.status(500).json({
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Server misconfiguration. Check server logs.',
      instance,
    } satisfies ProblemDetails);
    return;
  }

  // Unknown error — log and return 500
  logger.error({ err, requestId }, 'Unhandled error in request');
  res.status(500).json({
    type: 'about:blank',
    title: 'Internal Server Error',
    status: 500,
    detail: 'An unexpected error occurred. Check server logs for the request ID.',
    instance,
  } satisfies ProblemDetails);
}

interface OpenApiValidatorError {
  status: number;
  message: string;
  errors?: Array<{ path: string; message: string; errorCode?: string }>;
}

function isOpenApiValidatorError(err: unknown): err is OpenApiValidatorError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'errors' in err &&
    typeof (err as Record<string, unknown>)['status'] === 'number'
  );
}
