import { describe, it, expect } from 'vitest';

import { validCasesStringify, invalidCases } from '../cases.js';

import { stringifyUnicodeRangeSafe } from '../../src/stringify.js';

describe('stringify safe', () => {
  it('stringifyUnicodeRangeSafe is a function', () => {
    expect(stringifyUnicodeRangeSafe).toBeTypeOf('function');
  });

  it('parses values correctly', () => {
    const cases = Object.values(validCasesStringify).map(values => values[0]);

    for (const { value, expected } of cases) {
      expect(stringifyUnicodeRangeSafe(value)).toStrictEqual(expected);
    }
  });

  it('returns an empty array for invalid values', () => {
    for (const invalidValues of Object.values(invalidCases)) {
      for (const value of invalidValues) {
        expect(() => stringifyUnicodeRangeSafe(value)).not.toThrow();
        expect(stringifyUnicodeRangeSafe(value)).toStrictEqual([]);
      }
    }
  });
});
