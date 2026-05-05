import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  css: {
    // Override postcss config so Vite does not auto-discover postcss.config.mjs.
    // @tailwindcss/postcss requires the @tailwindcss/oxide native binding which
    // is not needed for unit tests (jsdom) and fails on CI runners that installed
    // via a macOS-generated lockfile lacking the linux-x64-gnu platform package.
    postcss: {
      plugins: [],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.tsx", "src/**/*.test.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
