import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Public landing page.
 * - Unauthenticated: shows sign-in / sign-up links.
 * - Authenticated: redirects to the dashboard.
 *
 * Phase 0 placeholder — no real content yet.
 */
export default async function HomePage() {
  const { userId } = await auth();

  // Authenticated users go straight to the dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-950">
          AAU Club Manager
        </h1>
        <p className="text-lg text-neutral-600">
          Club management platform for AAU basketball programs.
        </p>

        {/* Phase 0 scaffold — placeholder */}
        <p className="text-sm text-neutral-400">Phase 0 scaffold</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary-500 px-6 text-base font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 text-base font-medium text-neutral-800 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
