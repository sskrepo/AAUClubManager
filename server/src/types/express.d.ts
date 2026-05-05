/**
 * Declaration merging for Express Request.
 * Adds req.user shape populated by the Clerk auth middleware.
 */

declare namespace Express {
  interface Request {
    user?: {
      clerkUserId: string;
      email: string;
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
    };
    requestId?: string;
  }
}
