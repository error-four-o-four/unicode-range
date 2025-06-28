import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/unit/*.test.ts'],
    exclude: ['test/bench/*.bench.ts'],
  },
});
