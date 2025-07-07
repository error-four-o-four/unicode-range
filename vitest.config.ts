import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/unit/*.test.ts'],
    exclude: ['test/bench/*.bench.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
    },
    reporters: ['default', 'junit'],
    outputFile: './test-report.junit.xml',
  },
});
