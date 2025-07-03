import { describe, it, expect } from 'vitest';

import { validCases, invalidCases } from '../cases.js';

import { parseUnicodeRangeSafe } from '../../src/parse.js';

describe('parseUnicodeRangeSafe', () => {
  it('is a function', () => {
    expect(parseUnicodeRangeSafe).toBeTypeOf('function');
  });

  it('parses values correctly', () => {
    const cases = [
      validCases.single.samples[0],
      validCases.interval.samples[0],
      validCases.wildcard.samples[0],
      validCases['interval-wildcard'].samples[0],
      validCases.multiple.samples[0],
      validCases.arrays.samples[0],
    ];

    for (const { value, expected } of cases) {
      expect(parseUnicodeRangeSafe(value)).toStrictEqual(expected);
    }
  });

  it('returns an empty array for invalid values', () => {
    for (const invalidCase of Object.values(invalidCases)) {
      for (const value of invalidCase.samples) {
        expect(() => parseUnicodeRangeSafe(value)).not.toThrow();
        expect(parseUnicodeRangeSafe(value)).toStrictEqual([]);
      }
    }
  });
});
