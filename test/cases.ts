import { createRange } from '../src/utils.js';

export interface ValidParseCase {
  value: string | string[];
  expected: number[];
}

export const validCasesParse = {
  'single codepoint': [
    { value: 'U+0', expected: [0x0] },
    { value: 'U+90', expected: [0x90] },
    { value: 'U+A9f', expected: [0xa9f] },
    { value: 'u+00a9', expected: [0x00a9] },
    { value: 'u+00a9f', expected: [0x00a9f] },
    { value: 'u+10ffff', expected: [0x10ffff] },
  ],

  'interval range': [
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

  'wildcard range': [
    { value: 'U+?', expected: createRange(0x0, 0xF) },
    { value: 'U+0?', expected: createRange(0x00, 0x0F) },
    { value: 'U+0A?', expected: createRange(0x0A0, 0x0AF) },
    { value: 'U+0A??', expected: createRange(0x0A00, 0x0AFF) },
    { value: 'U+0F???', expected: createRange(0x0F000, 0x0FFFF) },
    { value: 'U+0F????', expected: createRange(0x0F0000, 0x0FFFFF) },
  ],

  'interval range w/ wildcard': [
    { value: 'U+10CC??-10DDDD', expected: createRange(0x10CC00, 0x10DDDD) },
    { value: 'U+1DF-1F?', expected: createRange(0x1DF, 0x1FF) },
    { value: 'U+1D?-1F?', expected: createRange(0x1D0, 0x1FF) },
  ],

  'multiple values': [
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

  'arrays of strings ': [
    { value: ['U+1D0', 'U+1DF-1FF'], expected: [0x1D0, ...createRange(0x1DF, 0x1FF)] },
  ],
} satisfies Record<string, ValidParseCase[]>;

export interface ValidStringifyCase {
  value: number[];
  expected: string[];
}

export const validCasesStringify = {
  'single codepoint': [
    { value: [0x0], expected: ['U+0'] },
    { value: [0x90], expected: ['U+90'] },
    { value: [0xA9F], expected: ['U+a9f'] },
    { value: [0x00A9], expected: ['U+a9'] },
    { value: [0x00a9f], expected: ['U+a9f'] },
    { value: [0x10ffff], expected: ['U+10ffff'] },
  ],

  'interval range': [
    { value: createRange(0x0, 0x9), expected: ['U+0-9'] },
    { value: createRange(0x000099, 0xaa), expected: ['U+99-aa'] },
  ],

  'multiple ranges': [
    {
      value: [0x0, 0x6, 0xa],
      expected: ['U+0', 'U+6', 'U+a'],
    },
    {
      value: [0x0, 0x1, 0x9, 0xa],
      expected: ['U+0-1', 'U+9-a'],
    },
    {
      value: [0x0, ...createRange(0x6, 0xa)],
      expected: ['U+0', 'U+6-a'],
    },
    {
      value: [...createRange(0x6, 0xa), 0xf],
      expected: ['U+6-a', 'U+f'],
    },
  ],
} satisfies Record<string, ValidStringifyCase[]>;

export const invalidCases = {
  'value': [
    NaN,
    null,
    undefined,
    true,
    // 0,
    {},
    // [], // @todo? how should an empty array be handled
    () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  ],

  'single codepoint string': [
    '',
    '00',
    '00gg',
    '00!=',
    'U+FFFFFF',
  ],

  'wildcard string': [
    'U+??aa',
    'U+??????',
  ],

  'interval string': [
    'U+00FF-0099',
    'U+999999-FFFFFF',
    'U+00000099-000000FF',
    'U+00FF??-0099??',
  ],

  'multiple strings': [
    'U+F, Invalid',
    ['U+F', NaN],
    'U+F, U+00FF-0099, U+00FF??-0099??',
    ['U+F', 'U+00FF-0099', 'U+00FF??-0099??'],
  ],

  'single codepoint number': [
    [-Infinity],
    [Infinity],
    [0x110000],
  ],

  'interval number': [
    [-0x1, 0x0],
    [0x10ffff, 0x110000],
  ],
};
