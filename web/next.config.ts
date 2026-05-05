import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Expose NEXT_PUBLIC_API_BASE_URL to the browser bundle.
   * Default: http://localhost:3001 (matches server dev port).
   * Override in web/.env.local for different environments.
   */
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "http://localhost:3001",
  },
};

export default nextConfig;
