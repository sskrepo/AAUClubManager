/**
 * Next.js 16 Proxy (replaces middleware.ts — see Next.js 16 migration guide).
 *
 * Uses Clerk's clerkMiddleware to protect all routes except:
 *  - /sign-in, /sign-up  — Clerk auth pages (public)
 *  - /                   — Landing page (public)
 *  - /_next/*            — Next.js internals
 *  - /favicon.ico, /public assets
 *
 * Defense-in-depth: the (authenticated) route group layout also checks auth.
 * This proxy is the primary guard — the layout check is a fallback.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export const proxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
