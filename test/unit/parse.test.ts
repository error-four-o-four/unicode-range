import { describe, it, expect } from 'vitest';

import { UnicodeRange } from '@japont/unicode-range';

import {
  // parseUnicodeRange,
  parseUnicodeRangeSync,
  parseUnicodeRangeSafeSync,
} from '../../src/index.js';

describe('parseUnicodeRangeSync', () => {
  it('is a function', () => {
    expect(parseUnicodeRangeSync).toBeTypeOf('function');
  });

  // it.skip('passes', () => {
  //   const val = 'u+0';

  //   const expected = UnicodeRange.parse([val]);
  //   expect(expected).toBeDefined();

  //   const result = parseUnicodeRangeSync(val);
  //   expect(result).toBeDefined();

  //   expect(result).toStrictEqual(expected);
  // });

  describe('parses single codepoints', () => {
    it.each([
      'U+0',
      'U+00A9',
      // 'U+  00A9',
      'U+10FFFF',
    ])('$0', (val) => {
      const expected = UnicodeRange.parse([val]);
      expect(expected).toBeDefined();

      const result = parseUnicodeRangeSync(val);
      expect(result).toBeDefined();

      expect(result).toStrictEqual(expected);
    });
  });

  describe('parses interval ranges', () => {
    it.each([
      'U+0-F',
      'U+00A9-00FF',
      // 'U+  00A9',
      'U+1000FF-10FFFF',
    ])('$0', (val) => {
      const expected = UnicodeRange.parse([val]);
      expect(expected).toBeDefined();

      const result = parseUnicodeRangeSync(val);
      expect(result).toBeDefined();

      expect(result).toStrictEqual(expected);
    });
  });

  it('parses lowercase values', () => {
    const val = 'u+00aa';

    const expected = UnicodeRange.parse([val]);
    expect(expected).toBeDefined();

    const result = parseUnicodeRangeSync(val);
    expect(result).toBeDefined();

    expect(result).toStrictEqual(expected);
  });

  describe('parses multiple values', () => {
    it.each([
      'U+0-F',
      'U+00A9-00FF',
      // 'U+  00A9',
      'U+1000FF-10FFFF',
    ])('$0', () => {
      const val = 'u+0, u+2, u+4-8';

      const expected = UnicodeRange.parse(val.replaceAll(' ', '').split(','));
      expect(expected).toBeDefined();

      const result = parseUnicodeRangeSync(val);
      expect(result).toBeDefined();

      expect(result).toStrictEqual(expected);
    });
  });

  describe('parses wildcard ranges', () => {
    it.each([
      'U+?',
      'U+0?????',
      'U+10CC??-10FFFF',
      'U+10CCFF-10FF??',
      'U+10CC??-10FF??',
    ])('$0', () => {
      const val = 'u+0, u+2, u+4-8';

      const expected = UnicodeRange.parse(val.replaceAll(' ', '').split(','));
      expect(expected).toBeDefined();

      const result = parseUnicodeRangeSync(val);
      expect(result).toBeDefined();

      expect(result).toStrictEqual(expected);
    });
  });

  describe('throws invalid values', () => {
    it.each([
      null,
      undefined,
      1,
      {},
      () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
      '',
      '00',
      '00gg',
      '00!=',
      'U+??aa',
      'U+??????',
      'U+00FF-0099',
      'U+00FF??-0099??',
    ])('$0', (val) => {
      if (val !== 'U+00FF-0099') {
        // @ts-expect-error invalid value
        expect(() => UnicodeRange.parse([val])).toThrow();
      }

      // @ts-expect-error invalid value
      expect(() => parseUnicodeRangeSync(val)).toThrow();
    });
  });

  describe('surpasses \'@japont/unicode-range\' because', () => {
    it('accepts multiple values by default', () => {
      const val = 'U+0000-0033, U+0066-0099, U+00CC-00FF';

      // @ts-expect-error incorrect
      expect(() => UnicodeRange.parse(val)).toThrow();

      const result = parseUnicodeRangeSync(val);
      expect(result).toBeDefined();
      expect(result).toStrictEqual(
        UnicodeRange.parse(val.replaceAll(' ', '').split(',')),
      );
    });

    it('accepts an array of multiple values by default', () => {
      const val = ['U+0033-0066, U+0099-00AA', 'U+0066-0099, U+00CC-00FF'];

      expect(() => UnicodeRange.parse(val)).toThrow();

      const result = parseUnicodeRangeSync(val);
      expect(result).toBeDefined();

      expect(result).toStrictEqual(
        UnicodeRange.parse(val.map(item => item.replaceAll(' ', '').split(',')).flat()),
      );
    });

    it('throws invalid interval range U+00FF-0099', () => {
      const val = 'U+00FF-0099';
      expect(parseUnicodeRangeSafeSync(val)).toStrictEqual([]);

      expect(() => UnicodeRange.parse([val])).not.toThrow();
      expect(() => parseUnicodeRangeSync(val)).toThrow();
    });
  });
});

describe('parseUnicodeRange', () => {
  it.todo('is a function', () => {
    expect(parseUnicodeRangeSync).toBeTypeOf('function');
  });
});
