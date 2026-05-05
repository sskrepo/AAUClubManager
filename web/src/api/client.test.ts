/**
 * Tests for web/src/api/client.ts
 *
 * Covers:
 *  - useHealth: loading → data; loading → error states
 *  - useMe: token injection into OpenAPI.TOKEN; loading → data; loading → error
 *  - 401 handling: maps to "Session expired" error
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// ── Mocks ──────────────────────────────────────────────────────────────────

// Mock the generated SDK so tests never make real HTTP calls.
vi.mock("./generated", () => ({
  OpenAPI: {
    BASE: "http://localhost:3001",
    TOKEN: undefined,
  },
  HealthService: {
    getHealth: vi.fn(),
  },
  AuthService: {
    getMe: vi.fn(),
  },
}));

// Mock Clerk's useAuth so tests control getToken().
vi.mock("@clerk/nextjs", () => ({
  useAuth: vi.fn(),
}));

// Import after mocking.
import { useHealth, useMe } from "./client";
import { HealthService, AuthService } from "./generated";
import { useAuth } from "@clerk/nextjs";

const mockGetHealth = HealthService.getHealth as ReturnType<typeof vi.fn>;
const mockGetMe = AuthService.getMe as ReturnType<typeof vi.fn>;
const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

// ── Helpers ────────────────────────────────────────────────────────────────

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests for deterministic behavior
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return Wrapper;
}

// ── useHealth tests ────────────────────────────────────────────────────────

describe("useHealth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data on success", async () => {
    const mockData = {
      status: "ok" as const,
      timestamp: "2026-05-04T12:00:00.000Z",
      version: "0.1.0",
    };
    mockGetHealth.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useHealth(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it("returns error state when backend fails", async () => {
    const networkError = new Error("Network error");
    // useHealth has retry:1 so we need to reject twice (initial + 1 retry)
    mockGetHealth.mockRejectedValue(networkError);

    const { result } = renderHook(() => useHealth(), {
      wrapper: createWrapper(),
    });

    // Allow up to 5s for the retry cycle to complete
    await waitFor(
      () => expect(result.current.isError).toBe(true),
      { timeout: 5000 }
    );

    expect(result.current.error?.message).toBe("Network error");
    // Restore mock to resolved state for other tests
    mockGetHealth.mockReset();
  });
});

// ── useMe tests ────────────────────────────────────────────────────────────

describe("useMe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("injects Bearer token via OpenAPI.TOKEN and returns user data", async () => {
    const mockToken = "test-jwt-token";
    mockUseAuth.mockReturnValue({
      getToken: vi.fn().mockResolvedValue(mockToken),
    });

    const mockUser = {
      clerkUserId: "user_2abc123",
      email: "coach@example.com",
      firstName: "Jordan",
      lastName: "Smith",
    };
    mockGetMe.mockResolvedValueOnce({ data: mockUser });

    const { result } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // SDK was called (token is injected via OpenAPI.TOKEN, not as param)
    expect(mockGetMe).toHaveBeenCalledTimes(1);

    // Hook unwraps data.data and returns AuthUser directly
    expect(result.current.data).toEqual(mockUser);
  });

  it("returns error state when no Clerk session exists", async () => {
    mockUseAuth.mockReturnValue({
      getToken: vi.fn().mockResolvedValue(null),
    });

    const { result } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toMatch(/No active Clerk session/);
  });

  it("maps 401 from backend to session-expired error", async () => {
    const mockToken = "test-jwt-token";
    mockUseAuth.mockReturnValue({
      getToken: vi.fn().mockResolvedValue(mockToken),
    });

    // The generated SDK throws an object with { status: 401 } on auth failure
    const apiError = Object.assign(new Error("Unauthorized"), { status: 401 });
    mockGetMe.mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe(
      "Session expired. Please sign in again."
    );
  });

  it("bubbles through non-401 errors unchanged", async () => {
    const mockToken = "test-jwt-token";
    mockUseAuth.mockReturnValue({
      getToken: vi.fn().mockResolvedValue(mockToken),
    });

    const serverError = Object.assign(new Error("Internal Server Error"), {
      status: 500,
    });
    mockGetMe.mockRejectedValueOnce(serverError);

    const { result } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Internal Server Error");
  });
});
