"use client";

import { useMe } from "@/api/client";

/**
 * Client component for the /me page.
 * Calls useMe() and renders all three states: loading, error, success.
 */
export function MePageClient() {
  const { data, isLoading, isError, error } = useMe();

  return (
    <main className="p-8">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-neutral-950">
          Auth Identity Probe — <code className="text-base">/me</code>
        </h1>
        <p className="text-sm text-neutral-600">
          This page calls <code>GET /api/v1/me</code> on the backend and displays
          the result. Use it to verify the end-to-end auth pipeline is working.
        </p>

        {isLoading && (
          <div
            className="rounded-lg border border-neutral-200 bg-white p-6"
            role="status"
            aria-label="Loading user data"
          >
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-48 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        )}

        {isError && (
          <div
            className="rounded-lg border border-error-500 bg-error-100 p-6"
            role="alert"
          >
            <h2 className="text-base font-semibold text-error-500">
              Backend request failed
            </h2>
            <p className="mt-1 text-sm text-neutral-700">
              {error?.message ?? "Unknown error"}
            </p>
            <p className="mt-3 text-xs text-neutral-500">
              Is the server running at{" "}
              <code>{process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "http://localhost:3001"}</code>?
            </p>
          </div>
        )}

        {data && (
          <div className="rounded-lg border border-success-500 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-success-500">
              Backend responded — auth pipeline working
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex gap-4">
                <dt className="w-32 font-medium text-neutral-600">Clerk User ID</dt>
                <dd className="font-mono text-neutral-900">{data.clerkUserId}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-32 font-medium text-neutral-600">Email</dt>
                <dd className="text-neutral-900">{data.email}</dd>
              </div>
              {data.firstName && (
                <div className="flex gap-4">
                  <dt className="w-32 font-medium text-neutral-600">First name</dt>
                  <dd className="text-neutral-900">{data.firstName}</dd>
                </div>
              )}
              {data.lastName && (
                <div className="flex gap-4">
                  <dt className="w-32 font-medium text-neutral-600">Last name</dt>
                  <dd className="text-neutral-900">{data.lastName}</dd>
                </div>
              )}
              {data.imageUrl && (
                <div className="flex gap-4">
                  <dt className="w-32 font-medium text-neutral-600">Avatar</dt>
                  <dd>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.imageUrl}
                      alt="User avatar"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                  </dd>
                </div>
              )}
            </dl>

            <details className="mt-4">
              <summary className="cursor-pointer text-xs text-neutral-400 hover:text-neutral-600">
                Raw JSON
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-neutral-50 p-3 text-xs text-neutral-700">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </main>
  );
}
