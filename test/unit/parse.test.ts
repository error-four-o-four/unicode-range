import { describe, it, expect } from 'vitest';

import { validCases, invalidCases, type ValidSample } from '../cases.js';

import { parseUnicodeRange } from '../../src/parse.js';

describe('parseUnicodeRange', () => {
  it('is a function', () => {
    expect(parseUnicodeRange).toBeTypeOf('function');
  });

  it('returns an array of number', () => {
    const result = parseUnicodeRange('U+9');
    expect(result).toBeDefined();
    expect(result).toStrictEqual([0x9]);
  });

  it.each([
    ['a string', validCases.single.samples[0].value],
    ['a string with multiple values', validCases.multiple.samples[0].value],
    ['an array of strings', validCases.arrays.samples[0].value],
  ])('accepts $0 $1', (_, value) => {
    expect(() => parseUnicodeRange(value)).not.toThrow();
  });

  it('dedupes multiple values', () => {
    const value = Array.from({ length: 10 }, () => 'U+9');
    expect(parseUnicodeRange(value)).toStrictEqual([0x9]);
    expect(parseUnicodeRange(value.join(', '))).toStrictEqual([0x9]);
  });

  it('sorts multiple values by default', () => {
    expect(parseUnicodeRange(['U+F', 'U+A', 'U+9'])).toStrictEqual([0x9, 0xA, 0xF]);
  });

  it('does not sort multiple values when an optional boolean \'true\' is passed', () => {
    expect(parseUnicodeRange(['U+F', 'U+A', 'U+9'], true)).toStrictEqual([0xF, 0xA, 0x9]);
  });

  it('parses lowercase values correctly \'u+00aa\'', () => {
    expect(parseUnicodeRange('u+00aa')).toStrictEqual([0x00aa]);
  });

  describe('parses valid values correctly', () => {
    for (const validCase of Object.values(validCases)) {
      describe(validCase.name, () => {
        it.for<ValidSample>(validCase.samples)(`$value`, ({ value, expected }) => {
          const result = parseUnicodeRange(value);
          expect(result).toBeDefined();
          expect(result).toStrictEqual(expected);
        });
      });
    }
  });

  describe('throws invalid values', () => {
    for (const invalidCase of Object.values(invalidCases)) {
      describe(invalidCase.name, () => {
        it.for(invalidCase.samples)(`$0`, (value) => {
          // @ts-expect-error invalid value
          expect(() => parseUnicodeRange(value)).toThrow();
        });
      });
    }
  });

  // describe('surpasses \'@japont/unicode-range\' because', () => {
  //   it('accepts multiple values by default', () => {
  //     const val = 'U+0000-0033, U+0066-0099, U+00CC-00FF';

  //     // @ts-expect-error incorrect
  //     expect(() => UnicodeRange.parse(val)).toThrow();

  //     const result = parseUnicodeRange(val);
  //     expect(result).toBeDefined();
  //     expect(result).toStrictEqual(
  //       UnicodeRange.parse(val.replaceAll(' ', '').split(',')),
  //     );
  //   });

  //   it('throws invalid interval range U+00FF-0099', () => {
  //     const val = 'U+00FF-0099';
  //     expect(parseUnicodeRangeSafeSync(val)).toStrictEqual([]);

  //     expect(() => UnicodeRange.parse([val])).not.toThrow();
  //     expect(() => parseUnicodeRange(val)).toThrow();
  //   });
  // });
});
