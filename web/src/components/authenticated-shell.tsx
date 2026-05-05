"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { LogOut, Trophy } from "lucide-react";
import type { ReactNode } from "react";

interface AuthenticatedShellProps {
  children: ReactNode;
}

/**
 * Client component shell for authenticated pages.
 *
 * Phase 0: minimal nav header with the user's email and a sign-out button.
 * Phase 1: this becomes a full sidebar + header layout per UX wireframes.
 */
export function AuthenticatedShell({ children }: AuthenticatedShellProps) {
  const { user } = useUser();

  const displayEmail = user?.emailAddresses[0]?.emailAddress ?? "";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo / app name */}
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary-500" aria-hidden="true" />
            <span className="text-base font-semibold text-neutral-950">
              AAU Club Manager
            </span>
          </div>

          {/* User info + sign out */}
          <div className="flex items-center gap-4">
            {displayEmail && (
              <span className="hidden text-sm text-neutral-600 sm:block">
                {displayEmail}
              </span>
            )}
            <SignOutButton>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="flex-1 bg-neutral-50">{children}</div>
    </div>
  );
}
