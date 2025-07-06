import { describe, it, expect } from 'vitest';

import { validCasesParse, invalidCases } from '../cases.js';

import { parseUnicodeRangeSafe } from '../../src/parse.js';

describe('parse safe', () => {
  it('parseUnicodeRangeSafe is a function', () => {
    expect(parseUnicodeRangeSafe).toBeTypeOf('function');
  });

  it('parses values correctly', () => {
    const cases = Object.values(validCasesParse).map(values => values[0]);

    for (const { value, expected } of cases) {
      expect(parseUnicodeRangeSafe(value)).toStrictEqual(expected);
    }
  });

  it('returns an empty array for invalid values', () => {
    for (const invalidValues of Object.values(invalidCases)) {
      for (const value of invalidValues) {
        expect(() => parseUnicodeRangeSafe(value)).not.toThrow();
        expect(parseUnicodeRangeSafe(value)).toStrictEqual([]);
      }
    }
  });
});
