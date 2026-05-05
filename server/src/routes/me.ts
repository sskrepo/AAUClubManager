/**
 * GET /api/v1/me — returns authenticated Clerk user identity.
 * Requires auth middleware to have run and populated req.user.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { UnauthorizedError } from '../middleware/error.js';

export const meRouter = Router();

meRouter.get('/api/v1/me', requireAuth, (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      // This should never happen if requireAuth ran, but guard defensively
      next(new UnauthorizedError('No authenticated user found'));
      return;
    }

    res.status(200).json({
      data: {
        clerkUserId: req.user.clerkUserId,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        imageUrl: req.user.imageUrl,
      },
    });
  } catch (err: unknown) {
    next(err);
  }
});
