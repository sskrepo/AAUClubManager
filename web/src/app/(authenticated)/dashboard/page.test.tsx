/**
 * Tests for app/(authenticated)/page.tsx
 *
 * Covers:
 *  - Renders with mocked user data (displayName from firstName)
 *  - Falls back to email when firstName is absent
 *  - Shows Clerk user ID
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock Clerk's server-side functions used in the server component.
// Since this is a Server Component we test it by mocking its deps
// and calling it as an async function.
vi.mock("@clerk/nextjs/server", () => ({
  currentUser: vi.fn(),
  auth: vi.fn().mockResolvedValue({ userId: "user_2abc" }),
}));

import { currentUser } from "@clerk/nextjs/server";
import DashboardPage from "./page";

const mockCurrentUser = currentUser as ReturnType<typeof vi.fn>;

// ── Tests ──────────────────────────────────────────────────────────────────

describe("DashboardPage (authenticated)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("greets user by first name when available", async () => {
    mockCurrentUser.mockResolvedValueOnce({
      id: "user_2abc123",
      firstName: "Jordan",
      lastName: "Smith",
      emailAddresses: [{ emailAddress: "coach@example.com" }],
    });

    // Server component — call as async function and render the result
    const element = await DashboardPage();
    render(element as React.ReactElement);

    expect(screen.getByText(/Hello, Jordan!/)).toBeInTheDocument();
  });

  it("falls back to email when firstName is absent", async () => {
    mockCurrentUser.mockResolvedValueOnce({
      id: "user_2abc123",
      firstName: null,
      lastName: null,
      emailAddresses: [{ emailAddress: "coach@example.com" }],
    });

    const element = await DashboardPage();
    render(element as React.ReactElement);

    expect(screen.getByText(/Hello, coach@example.com!/)).toBeInTheDocument();
  });

  it("shows the Clerk user ID", async () => {
    mockCurrentUser.mockResolvedValueOnce({
      id: "user_2abc123XYZ",
      firstName: "Jordan",
      emailAddresses: [{ emailAddress: "coach@example.com" }],
    });

    const element = await DashboardPage();
    render(element as React.ReactElement);

    expect(screen.getByText(/user_2abc123XYZ/)).toBeInTheDocument();
  });

  it("shows fallback greeting when user is null", async () => {
    mockCurrentUser.mockResolvedValueOnce(null);

    const element = await DashboardPage();
    render(element as React.ReactElement);

    expect(screen.getByText(/Hello, there!/)).toBeInTheDocument();
  });
});
