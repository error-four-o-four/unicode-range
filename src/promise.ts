import {
  CODEPOINT_MAX,
  createSet,
  getErrorMessage,
  regexUnicodeRange,
  regexTrailingChars,
  splitRanges,
} from './utils.js';

// ------------------------- //
// parse unicode-range async //
// ------------------------- //

export const parseSingleUnicodeValue = async (input: string): Promise<number | [number, number] | undefined> => {
  if (input.includes('?')) {
    // it's a wildcard range
    if (regexTrailingChars.test(input)) return;

    const [a, b] = await Promise.all([
      parseInt(input.replaceAll('?', '0'), 16),
      parseInt(input.replaceAll('?', 'f'), 16),
    ]);

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

export const parseUnicodeRangeValue = async (value: string): Promise<Set<number>> => {
  const [, hexStart, hexEnd] = regexUnicodeRange.exec(value) ?? [];

  if (!hexStart) {
    throw new TypeError(getErrorMessage(value));
  };

  // it's a single codepoint or wildcard range
  if (!hexEnd) {
    const num = await parseSingleUnicodeValue(hexStart);

    if (!num) {
      throw new TypeError(getErrorMessage(value));
    }

    return (Array.isArray(num))
      ? createSet(...num)
      : new Set([num]);
  }

  // it is an interval range
  const [start, end] = await Promise.all([
    parseSingleUnicodeValue(hexStart),
    parseSingleUnicodeValue(hexEnd),
  ]);

  if (
    (!start || !end)
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

export const parseUnicodeRange = async (input: string | string[]): Promise<number[]> => {
  const ranges = splitRanges(input);
  const result = new Set<number>();

  await Promise.all(ranges.map(async (range) => {
    const codepoints = await parseUnicodeRangeValue(range);
    for (const codepoint of codepoints) {
      result.add(codepoint);
    }
  }));

  return [...result.values()].sort((a, b) => a - b);
};

export const parseUnicodeRangeSafe = async (input: string | string[]): Promise<number[]> => {
  try {
    return await parseUnicodeRange(input);
  } catch (error) {
    console.warn(
      `Failed to parse unicode-range: ${JSON.stringify(input)} — ${
        (error instanceof Error) ? error.message : String(error) || 'Unhandled'
      }`,
    );
  }

  return [];
};
