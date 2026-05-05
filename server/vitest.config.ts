import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.integration.test.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['src/scripts/**', 'src/workers/**'],
    },
  },
});
