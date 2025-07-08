import { describe, it, expect } from 'vitest';

import '../../src/global.js';

describe('the package', () => {
  it('provides a global object', () => {
    expect(UnicodeRange).toBeDefined();
  });
});
