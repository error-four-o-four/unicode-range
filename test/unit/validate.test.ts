import { describe, it, expect } from 'vitest';

import {
  validCases,
  invalidCases,
  type ValidSample,
} from '../cases.js';

import { isValidUnicodeRange } from '../../src/validate.js';

describe('isValidUnicodeRange', () => {
  it('is a function', () => {
    expect(isValidUnicodeRange).toBeTypeOf('function');
  });

  it('returns a boolean', () => {
    const result = isValidUnicodeRange('U+9');
    expect(result).toBeDefined();
    expect(result).toBe(true);
  });

  it(`accepts a string '${validCases.single.samples[0].value}'`, () => {
    expect(() => isValidUnicodeRange(validCases.single.samples[0].value)).not.toThrow();
  });

  it(`accepts a string with multiple values '${validCases.multiple.samples[0].value}'`, () => {
    expect(() => isValidUnicodeRange(validCases.multiple.samples[0].value)).not.toThrow();
  });

  it(`accepts an array of strings '${String(validCases.arrays.samples[0].value)}'`, () => {
    expect(() => isValidUnicodeRange(validCases.arrays.samples[0].value)).not.toThrow();
  });

  describe(`returns 'true' for valid values`, () => {
    for (const validCase of Object.values(validCases)) {
      describe(validCase.name, () => {
        it.for<ValidSample>(validCase.samples)(`$value`, ({ value }) => {
          expect(isValidUnicodeRange(value)).toBe(true);
        });
      });
    }
  });

  describe(`returns 'false' for invalid values`, () => {
    for (const invalidCase of Object.values(invalidCases)) {
      describe(invalidCase.name, () => {
        it.for(invalidCase.samples)(`$0`, (value) => {
          expect(isValidUnicodeRange(value)).toBe(false);
        });
      });
    }
  });
});
