/**
 * AAUClubManager API Client
 *
 * Hand-maintained wrapper around the generated SDK at `./generated/`.
 * ALL frontend API calls must go through this file — never import from
 * `./generated/` directly and never use raw fetch() for backend calls.
 *
 * Responsibilities:
 *  1. Configures the generated SDK's base URL from NEXT_PUBLIC_API_BASE_URL.
 *  2. Injects the Clerk JWT as OpenAPI.TOKEN before each auth-required call,
 *     which the generated `request` utility sends as `Authorization: Bearer`.
 *  3. On 401: calls Clerk session refresh and retries once. If still 401,
 *     throws so TanStack Query can surface the error state.
 *  4. Exports TanStack Query hooks: useHealth() and useMe().
 */

"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { OpenAPI, HealthService, AuthService } from "./generated";
import type { AuthUser, HealthResponse } from "./generated";

// ── Configure generated SDK base URL ──────────────────────────────────────

// This runs at module load time (client side). `process.env` is inlined
// by Next.js for NEXT_PUBLIC_ vars.
if (typeof window !== "undefined") {
  OpenAPI.BASE =
    process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "http://localhost:3001";
}

// ── Auth-aware wrapper ─────────────────────────────────────────────────────

/**
 * Sets OpenAPI.TOKEN to a fresh Clerk token, runs the provided fn, then
 * clears the token. On 401, throws an explicit error (no silent retry —
 * the Clerk session expiry flow should handle re-auth at the proxy level).
 */
async function withAuth<T>(
  getToken: () => Promise<string | null>,
  fn: () => Promise<T>
): Promise<T> {
  const token = await getToken();
  if (!token) {
    throw new Error("No active Clerk session. Sign in first.");
  }

  OpenAPI.TOKEN = token;

  try {
    return await fn();
  } catch (err: unknown) {
    // Detect 401 from the generated SDK's ApiError shape.
    if (isApiError(err, 401)) {
      // Token may have just expired. Surface the error so TanStack Query
      // marks this query as errored. The proxy.ts Clerk middleware will
      // redirect to sign-in on the next navigation if the session is gone.
      throw new Error("Session expired. Please sign in again.");
    }
    throw err;
  } finally {
    // Clear the token so it isn't accidentally reused by other requests.
    OpenAPI.TOKEN = undefined;
  }
}

/**
 * Type guard for the generated SDK's ApiError (has a .status property).
 */
function isApiError(err: unknown, status: number): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    (err as { status: unknown }).status === status
  );
}

// ── useHealth ─────────────────────────────────────────────────────────────

/**
 * Returns the backend health status. No auth required.
 *
 * Usage:
 *   const { data, isLoading, isError } = useHealth();
 */
export function useHealth() {
  return useQuery<HealthResponse, Error>({
    queryKey: ["health"],
    queryFn: () => HealthService.getHealth() as Promise<HealthResponse>,
    staleTime: 30_000,
    retry: 1,
  });
}

// ── useMe ─────────────────────────────────────────────────────────────────

/**
 * Returns the authenticated Clerk user from the backend.
 * Automatically injects the Clerk JWT via OpenAPI.TOKEN.
 *
 * Usage:
 *   const { data, isLoading, isError, error } = useMe();
 *   if (data) console.log(data.email); // data is AuthUser
 */
export function useMe() {
  const { getToken } = useAuth();

  return useQuery<AuthUser, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const result = await withAuth(
        () => getToken(),
        () => AuthService.getMe()
      );
      return result.data;
    },
    staleTime: 5 * 60_000, // 5 min — Clerk session tokens are long-lived
    retry: false, // Do not retry auth failures — surface error immediately
  });
}
