import {
  CODEPOINT_MAX,
  createSet,
  getErrorMessage,
  regexUnicodeRange,
  regexTrailingChars,
  splitRanges,
} from './utils.js';

export const parseSingleUnicodeValueSync = (input: string): number | [number, number] | undefined => {
  if (input.includes('?')) {
    // it's a wildcard range
    if (regexTrailingChars.test(input)) return;

    const a = parseInt(input.replaceAll('?', '0'), 16);
    const b = parseInt(input.replaceAll('?', 'f'), 16);

    if (
      Number.isNaN(a)
      || Number.isNaN(b)
      || a > CODEPOINT_MAX
      || b > CODEPOINT_MAX
      || a > b
    ) return;

    return [a, b];
  }

  const n = parseInt(input, 16);

  if (Number.isNaN(n) || n > CODEPOINT_MAX) return;

  return n;
};

export const parseUnicodeRangeValueSync = (value: string): Set<number> => {
  const [, hexStart, hexEnd] = regexUnicodeRange.exec(value) ?? [];

  if (!hexStart) {
    throw new TypeError(getErrorMessage(value));
  };

  // it's a single codepoint or wildcard range
  if (hexEnd === undefined) {
    const num = parseSingleUnicodeValueSync(hexStart);

    if (num === undefined) {
      throw new TypeError(getErrorMessage(value));
    }

    return (Array.isArray(num))
      ? createSet(...num)
      : new Set([num]);
  }

  // it is an interval range
  const start = parseSingleUnicodeValueSync(hexStart);
  const end = parseSingleUnicodeValueSync(hexEnd);

  if (
    (start === undefined || end === undefined)
    || (typeof start === 'number' && typeof end === 'number' && start > end)
  ) {
    throw new TypeError(getErrorMessage(value));
  }

  // Normalize to [start, end]
  const [numStartA, numStartB] = Array.isArray(start) ? start : [start, start];
  const [numEndA, numEndB] = Array.isArray(end) ? end : [end, end];

  // Check for invalid range
  if (
    numStartA > numEndA
    || numStartA > numEndB
    || numStartB > numEndA
    || numStartB > numEndB
  ) {
    throw new TypeError(getErrorMessage(value));
  };

  return createSet(numStartA, numEndB);
};

export const parseUnicodeRangeSync = (input: string | string[]): number[] => {
  const ranges = splitRanges(input);
  const result = new Set<number>();

  for (const range of ranges) {
    for (const codepoint of parseUnicodeRangeValueSync(range)) {
      result.add(codepoint);
    }
  }

  return [...result.values()].sort((a, b) => a - b);
};

export const parseUnicodeRangeSafeSync = (input: string | string[]): number[] => {
  try {
    return parseUnicodeRangeSync(input);
  } catch (error) {
    console.warn(
      `Failed to parse unicode-range: ${JSON.stringify(input)} — ${
        (error instanceof Error) ? error.message : String(error) || 'Unhandled'
      }`,
    );
  }

  return [];
};
