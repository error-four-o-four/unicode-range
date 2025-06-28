import { bench, describe } from 'vitest';

import { UnicodeRange } from '@japont/unicode-range';

import {
  // parseUnicodeRangeAggregated,
  // parseUnicodeRangeValue,
  parseUnicodeRangeValueSync,
  // parseUnicodeRange,
  parseUnicodeRangeSync,
} from '../../src/index.js';

const options = {
  time: 2000,
};

const japont = '@japont';
const http404 = '@http404';
// const subpath = 'unicode-range';

describe.concurrent(`compare '${japont}' and '${http404}'`, () => {
  describe('single codepoint', () => {
    const value = 'U+10ABCD';

    bench(
      `${japont} UnicodeRange.parse '${value}'`,
      () => void UnicodeRange.parse([value]),
      options,
    );

    bench(
      `${http404} parseUnicodeRangeValueSync '${value}'`,
      () => void parseUnicodeRangeValueSync(value),
      options,
    );

    // bench(
    //   `${http404} parseUnicodeRangeValue '${value}'`,
    //   async () => void await parseUnicodeRangeValue(value),
    //   options,
    // );
  });

  describe('wildcard range', () => {
    const value = 'U+10????';

    bench(
      `${japont} UnicodeRange.parse '${value}'`,
      () => void UnicodeRange.parse([value]),
      options,
    );

    bench(
      `${http404} parseUnicodeRangeValueSync '${value}'`,
      () => void parseUnicodeRangeValueSync(value),
      options,
    );

    // bench(
    //   `${http404} parseUnicodeRangeValue '${value}'`,
    //   async () => void await parseUnicodeRangeValue(value),
    //   options,
    // );
  });

  describe('interval range', () => {
    const value = 'U+10ABCD-10FFFF';

    bench(
      `${japont} UnicodeRange.parse '${value}'`,
      () => void UnicodeRange.parse([value]),
      options,
    );

    bench(
      `${http404} parseUnicodeRangeValueSync '${value}'`,
      () => void parseUnicodeRangeValueSync(value),
      options,
    );

    // bench(
    //   `${http404} parseUnicodeRangeValue '${value}'`,
    //   async () => void await parseUnicodeRangeValue(value),
    //   options,
    // );
  });

  describe('multiple values', () => {
    const value = 'U+0, U+00, U+000, U+0000, U+000000, U+10ABCD-10FFFF';

    bench(
      `${japont} UnicodeRange.parse '${value}'`,
      () => {
        const values = value.split(/,\s*/g);
        UnicodeRange.parse(values);
      },
      options,
    );

    bench(
      `${http404} parseUnicodeRangeSync '${value}'`,
      () => void parseUnicodeRangeSync(value),
      options,
    );

    // bench(
    //   `${http404} parseUnicodeRange '${value}'`,
    //   async () => void await parseUnicodeRange(value),
    //   options,
    // );
  });
});
