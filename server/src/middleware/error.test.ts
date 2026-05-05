/**
 * Unit tests for the RFC 7807 error handler middleware.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import {
  errorHandler,
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationAppError,
} from './error.js';

function buildApp(throwFn: (req: Request, res: Response, next: NextFunction) => void): express.Application {
  const app = express();
  app.use(express.json());
  app.get('/test', (req, res, next) => {
    try {
      throwFn(req, res, next);
    } catch (err) {
      next(err);
    }
  });
  app.use(errorHandler);
  return app;
}

describe('errorHandler middleware (RFC 7807)', () => {
  it('formats AppError correctly', async () => {
    const app = buildApp((_req, _res, next) => {
      next(new AppError(400, 'Bad Request', 'Something went wrong'));
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      type: 'about:blank',
      title: 'Bad Request',
      status: 400,
      detail: 'Something went wrong',
    });
  });

  it('formats NotFoundError as 404', async () => {
    const app = buildApp((_req, _res, next) => {
      next(new NotFoundError('Resource not found'));
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(404);
    expect(res.body.title).toBe('Not Found');
  });

  it('formats UnauthorizedError as 401', async () => {
    const app = buildApp((_req, _res, next) => {
      next(new UnauthorizedError('Bad token'));
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      type: 'about:blank',
      title: 'Unauthorized',
      status: 401,
      detail: 'Bad token',
    });
  });

  it('formats ForbiddenError as 403', async () => {
    const app = buildApp((_req, _res, next) => {
      next(new ForbiddenError('No access'));
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(403);
    expect(res.body.title).toBe('Forbidden');
  });

  it('formats ValidationAppError with errors array', async () => {
    const app = buildApp((_req, _res, next) => {
      next(
        new ValidationAppError('Validation failed', [
          { field: 'email', message: 'must be valid email', value: 'not-email' },
        ])
      );
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(422);
    expect(res.body).toMatchObject({
      title: 'Unprocessable Entity',
      status: 422,
      errors: [{ field: 'email', message: 'must be valid email' }],
    });
  });

  it('formats unknown errors as 500', async () => {
    const app = buildApp((_req, _res, next) => {
      next(new Error('Something exploded'));
    });

    const res = await request(app).get('/test');
    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
    });
  });
});
