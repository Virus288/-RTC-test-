import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    passWithNoTests: true,
    include: ['./test/unit/**/*.test.ts', './test/e2e/**/*.test.ts'],
    exclude: ['dist', 'docs', 'node_modules', 'config', '.github'],
    environment: 'node',
    globals: false,
    coverage: {
      reporter: ['text', 'lcov'],
    },
    setupFiles: ['./test/utils/setup.ts'],
    maxConcurrency: 1,
    testTimeout: 10000,
  },
});
