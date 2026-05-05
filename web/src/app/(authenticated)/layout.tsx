import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AuthenticatedShell } from "@/components/authenticated-shell";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

/**
 * Server layout for all authenticated routes.
 *
 * Defense-in-depth auth check: the proxy (proxy.ts) is the primary guard.
 * This layout provides a second check in case the proxy config is ever
 * misconfigured. Redirects to /sign-in if no session is found.
 */
export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
