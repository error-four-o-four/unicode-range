import { createRange } from '../src/utils.js';

export interface ValidSample {
  value: string | string[];
  expected: number[];
}

export interface ValidCase {
  name: string;
  samples: ValidSample[];
}

export const validCases = {
  'single': {
    name: 'single codepoint',
    samples: [
      { value: 'U+0', expected: [0x0] },
      { value: 'U+90', expected: [0x90] },
      { value: 'U+A9f', expected: [0xa9f] },
      { value: 'u+00a9', expected: [0x00a9] },
      { value: 'u+00a9f', expected: [0x00a9f] },
      { value: 'u+10ffff', expected: [0x10ffff] },
    ],
  },

  'interval': {
    name: 'interval range',
    samples: [
      { value: 'U+0-9', expected: createRange(0x0, 0x9) },
      { value: 'U+0-01', expected: createRange(0x0, 0x01) },
      { value: 'U+0-002', expected: createRange(0x0, 0x002) },
      { value: 'U+0-0003', expected: createRange(0x0, 0x0003) },
      { value: 'U+0-00004', expected: createRange(0x0, 0x00004) },
      { value: 'U+0-000005', expected: createRange(0x0, 0x000005) },
      { value: 'U+0A-0F', expected: createRange(0x0A, 0x0F) },
      { value: 'U+0A0-0FF', expected: createRange(0x0A0, 0x0FF) },
      { value: 'U+00A0-00FF', expected: createRange(0x00A0, 0x00FF) },
      { value: 'U+000A0-000FF', expected: createRange(0x000A0, 0x000FF) },
      { value: 'U+1000FF-10FFFF', expected: createRange(0x1000FF, 0x10FFFF) },
    ],
  },
  'wildcard': {
    name: 'wildcard range',
    samples: [
      { value: 'U+?', expected: createRange(0x0, 0xF) },
      { value: 'U+0?', expected: createRange(0x00, 0x0F) },
      { value: 'U+0A?', expected: createRange(0x0A0, 0x0AF) },
      { value: 'U+0A??', expected: createRange(0x0A00, 0x0AFF) },
      { value: 'U+0F???', expected: createRange(0x0F000, 0x0FFFF) },
      { value: 'U+0F????', expected: createRange(0x0F0000, 0x0FFFFF) },
    ],
  },
  'interval-wildcard': {
    name: 'interval range w/ wildcard',
    samples: [
      { value: 'U+10CC??-10DDDD', expected: createRange(0x10CC00, 0x10DDDD) },
      { value: 'U+1DF-1F?', expected: createRange(0x1DF, 0x1FF) },
      { value: 'U+1D?-1F?', expected: createRange(0x1D0, 0x1FF) },
    ],
  },
  'multiple': {
    name: 'multiple values',
    samples: [
      {
        value: 'U+0, U+01',
        expected: [0x0, 0x01],
      },
      {
        value: 'u+a?, u+b??',
        expected: Array.from(
          new Set([
            ...createRange(0xa0, 0xaf),
            ...createRange(0xb00, 0xbff),
          ]),
        ),
      },
      {
        value: 'U+aaa-ccc, U+aacc-aadd',
        expected: Array.from(
          new Set([
            ...createRange(0xaaa, 0xccc),
            ...createRange(0xaacc, 0xaadd),
          ]),
        ),

      },
      {
        value: 'U+0, U+00, U+aaa-ccc, U+aacc-aadd, u+a?, u+b??',
        expected: Array.from(
          new Set([
            0x0,
            ...createRange(0xA0, 0xAF),
            ...createRange(0xAAA, 0xCCC),
            ...createRange(0xAACC, 0xAADD),
            ...createRange(0xB00, 0xBFF),
          ]),
        ),
      },
    ],
  },
  'arrays': {
    name: 'array of string',
    samples: [
      { value: ['U+1D0', 'U+1DF-1FF'], expected: [0x1D0, ...createRange(0x1DF, 0x1FF)] },
    ],
  },
} satisfies Record<string, ValidCase>;

export const invalidCases = {
  values: {
    name: 'invalid values',
    samples: [
      null,
      undefined,
      true,
      0,
      {},
      // [], // @todo? how should an empty array be handled
      () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    ],
  },
  single: {
    name: 'invalid single codepoints',
    samples: [
      '',
      '00',
      '00gg',
      '00!=',
      'U+FFFFFF',
    ],
  },
  wildcard: {
    name: 'invalid wildcards',
    samples: [
      'U+??aa',
      'U+??????',
    ],
  },
  intaerval: {
    name: 'invalid intervals',
    samples: [
      'U+00FF-0099',
      'U+00FF??-0099??',
    ],
  },
};
