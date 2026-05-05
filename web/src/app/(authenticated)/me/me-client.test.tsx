/**
 * Tests for MePageClient component.
 *
 * Covers:
 *  - Loading state: skeleton animation is shown
 *  - Error state: error message is shown
 *  - Success state: user data is displayed
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock the API client so we control the hook's return value.
vi.mock("@/api/client", () => ({
  useMe: vi.fn(),
}));

import { useMe } from "@/api/client";
import { MePageClient } from "./me-client";

const mockUseMe = useMe as ReturnType<typeof vi.fn>;

// ── Tests ──────────────────────────────────────────────────────────────────

describe("MePageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseMe.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
    });

    render(<MePageClient />);

    // Loading skeleton is present
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading user data")).toBeInTheDocument();
  });

  it("renders error state when backend request fails", () => {
    mockUseMe.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: new Error("Connection refused"),
    });

    render(<MePageClient />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Backend request failed/)).toBeInTheDocument();
    expect(screen.getByText(/Connection refused/)).toBeInTheDocument();
  });

  it("renders user data on success", () => {
    const mockUser = {
      clerkUserId: "user_2abc123XYZ",
      email: "coach@example.com",
      firstName: "Jordan",
      lastName: "Smith",
    };

    mockUseMe.mockReturnValueOnce({
      data: mockUser,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    });

    render(<MePageClient />);

    expect(screen.getByText(/Backend responded/)).toBeInTheDocument();
    expect(screen.getByText("user_2abc123XYZ")).toBeInTheDocument();
    expect(screen.getByText("coach@example.com")).toBeInTheDocument();
    expect(screen.getByText("Jordan")).toBeInTheDocument();
    expect(screen.getByText("Smith")).toBeInTheDocument();
  });

  it("omits optional fields when absent", () => {
    const mockUser = {
      clerkUserId: "user_2abc123XYZ",
      email: "coach@example.com",
    };

    mockUseMe.mockReturnValueOnce({
      data: mockUser,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    });

    render(<MePageClient />);

    expect(screen.getByText("user_2abc123XYZ")).toBeInTheDocument();
    // firstName/lastName rows should not be present
    expect(screen.queryByText("First name")).not.toBeInTheDocument();
  });
});
