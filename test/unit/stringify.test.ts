import { describe, it, expect } from 'vitest';

// import { UnicodeRange } from '@japont/unicode-range';

import { invalidCases, validCasesStringify, type ValidStringifyCase } from '../cases.js';

import { stringifyUnicodeRange } from '../../src/stringify.js';
import { createRange } from '../../src/utils.js';

describe('stringify', () => {
  it('stringifyUnicodeRange is a function', () => {
    expect(stringifyUnicodeRange).toBeTypeOf('function');
  });

  it('returns an array of strings', () => {
    const result = stringifyUnicodeRange([0x9]);
    expect(result).toBeDefined();
    expect(result).toStrictEqual(['U+9']);
  });

  it('dedupes multiple values', () => {
    const value = Array.from({ length: 10 }, () => 0x9);
    expect(stringifyUnicodeRange(value)).toStrictEqual(['U+9']);
  });

  it('sorts multiple values', () => {
    const value = createRange(0xa, 0xf).sort(() => Math.random() < 0.5 ? 1 : -1);
    const expected = ['U+a-f'];
    expect(stringifyUnicodeRange(value)).toStrictEqual(expected);
  });

  describe('parses valid values correctly', () => {
    for (const [caseName, caseValues] of Object.entries(validCasesStringify)) {
      describe(caseName, () => {
        it.for<ValidStringifyCase>(caseValues)(`to $expected`, ({ value, expected }) => {
          const result = stringifyUnicodeRange(value);
          expect(result).toBeDefined();
          expect(result).toStrictEqual(expected);
        });
      });
    }
  });

  describe('throws invalid values', () => {
    it('string', () => {
      // @ts-expect-error invalid value
      expect(() => stringifyUnicodeRange('string')).toThrow();
    });

    const cases = ([
      'value',
      'single codepoint number',
      'interval number',
    ] satisfies (keyof typeof invalidCases)[])
      .reduce((all, key) => Object.assign(all, {
        [key]: invalidCases[key],
      }), {} as Record<string, (unknown)[]>);

    for (const [caseName, caseValues] of Object.entries(cases)) {
      describe(caseName, () => {
        const msg = caseName === 'value'
          ? '$0'
          : caseName === 'interval number'
            ? '[$0 $1]'
            : '[$0]';

        it.for(caseValues)(msg, (value) => {
          // @ts-expect-error invalid value
          expect(() => stringifyUnicodeRange(value)).toThrow();
        });
      });
    }
  });

  // it('works', () => {
  //   const values = [
  //     [0x0, 0x1, 0x2],
  //     [-0x1, 0x2, 0x3],
  //     [0x1, 0x2, 0x3],
  //   ];
  //   expect(stringifyUnicodeRange(values[0])).toStrictEqual(['U+0-2']);
  //   expect(stringifyUnicodeRange(values[1])).toStrictEqual(['U+1-3']);
  //   expect(UnicodeRange.stringify(values[0])).toStrictEqual(['U+1-2']); // !!!
  //   expect(UnicodeRange.stringify(values[1])).toStrictEqual(['U+1-3']);
  // });
});
