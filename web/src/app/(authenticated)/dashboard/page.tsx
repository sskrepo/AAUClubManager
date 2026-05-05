import { currentUser } from "@clerk/nextjs/server";

/**
 * Authenticated dashboard placeholder.
 * Phase 0: shows the signed-in user's name to prove auth is wired.
 * Phase 1+: this becomes the real dashboard.
 */
export default async function DashboardPage() {
  const user = await currentUser();

  const displayName =
    user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "there";

  return (
    <main className="p-8">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold text-neutral-950">
          Hello, {displayName}!
        </h1>
        <p className="text-neutral-600">
          Welcome to AAU Club Manager. Your auth scaffold is working correctly.
        </p>

        {/* Phase 0 scaffold indicator */}
        <div className="rounded-lg border border-primary-100 bg-primary-50 p-4">
          <p className="text-sm font-medium text-primary-700">
            Phase 0 scaffold — authenticated as{" "}
            <span className="font-mono text-xs">
              {user?.emailAddresses[0]?.emailAddress}
            </span>
          </p>
          <p className="mt-1 text-sm text-primary-600">
            Clerk user ID:{" "}
            <span className="font-mono text-xs">{user?.id}</span>
          </p>
        </div>

        <p className="text-sm text-neutral-400">
          Visit <a href="/me" className="underline">/me</a> to see data from the backend.
        </p>
      </div>
    </main>
  );
}
