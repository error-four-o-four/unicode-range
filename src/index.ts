// https://github.com/Japont/unicode-range
// https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range
// https://drafts.csswg.org/css-fonts-4/#unicode-range-desc

const CODEPOINT_MAX = 0x10FFFF;
const MAX_RANGE_LIMIT = 0x10000; // 65536 codepoints

const regexUnicodeRange = /^u\+([0-9a-f]?[0-9a-f?]{1,5})(?:-([0-9a-f?]{1,6}))?$/i;
const regexTrailingChars = /\?[^?]+$/;

const getErrorMessage = (value: unknown) => `'${String(value)}' is an invalid unicode-range-token`;

// const createRange = (a: number, b: number) => {
//   if (b - a + 1 > MAX_RANGE_LIMIT) {
//     throw new RangeError(`Unicode range exceeds reasonable size '${MAX_RANGE_LIMIT}'`);
//   }

//   return Array.from({ length: b - a + 1 }).map((_, i) => a + i);
// };

const createSet = (a: number, b: number) => {
  if (b - a + 1 > MAX_RANGE_LIMIT) {
    throw new RangeError(`Unicode range exceeds reasonable size '${MAX_RANGE_LIMIT}'`);
  }

  const set = new Set<number>();

  for (let i = a; i <= b; i += 1) {
    set.add(i);
  }

  return set;
};

// ----------------------- //
//   parse unicode-range   //
// ----------------------- //

const parseUnicodeValueSync = (input: string): number | [number, number] | undefined => {
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
    const num = parseUnicodeValueSync(hexStart);

    if (num === undefined) {
      throw new TypeError(getErrorMessage(value));
    }

    return (Array.isArray(num))
      ? createSet(...num)
      : new Set([num]);
  }

  // it is an interval range
  const start = parseUnicodeValueSync(hexStart);
  const end = parseUnicodeValueSync(hexEnd);

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

export const splitRanges = (input: string | string[]): string[] => {
  if (typeof input === 'string') {
    // has multiple values
    if (input.includes(',')) {
      return input.split(',').map(value => value.trim());
    }

    return [input.trim()];
  }

  const result = [];

  for (const value of input) {
    // has multiple values
    if (value.includes(',')) {
      result.push(...value.split(',').map(v => v.trim()));
      continue;
    }
    // has single value
    result.push(value.trim());
  }

  return result;
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

// ------------------------- //
// parse unicode-range async //
// ------------------------- //

const parseUnicodeValue = async (input: string): Promise<number | [number, number] | undefined> => {
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
    const num = await parseUnicodeValue(hexStart);

    if (!num) {
      throw new TypeError(getErrorMessage(value));
    }

    return (Array.isArray(num))
      ? createSet(...num)
      : new Set([num]);
  }

  // it is an interval range
  const [start, end] = await Promise.all([
    parseUnicodeValue(hexStart),
    parseUnicodeValue(hexEnd),
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

// -----------

// export const parseUnicodeRangeAggregated = async (input: string | string[]): Promise<number[]> => {
//   const ranges = splitRanges(input);
//   const results = await Promise.all(ranges.map(parseUnicodeRangeValue));

//   // Flatten all sets into one array
//   const allCodepoints = results.flatMap(set => Array.from(set));

//   return Array.from(new Set(allCodepoints)).sort((a, b) => a - b);
// };

// ----------------------- //
// validate unicode-range //
// ----------------------- //

export const isValidUnicodeRangeSync = (input: unknown): boolean => {
  if (typeof input !== 'string' && !Array.isArray(input)) return false;

  try {
    parseUnicodeRangeSync(input);
  } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return false;
  }

  return true;
};

export const isValidUnicodeRange = async (input: unknown): Promise<boolean> => {
  if (typeof input !== 'string' && !Array.isArray(input)) return false;

  try {
    await parseUnicodeRange(input);
  } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return false;
  }

  return true;
};

// ----------------------- //
// stringify unicode-range //
// ----------------------- //

const rangeString = (start: number, end?: number) => {
  if (!end || start === end) {
    return `U+${start.toString(16)}`;
  }
  return `U+${start.toString(16)}-${end.toString(16)}`;
};

export const stringify = (arr: number[]): string[] => {
  const sorted = Array.from(new Set(arr)).sort((a, b) => a - b);
  const results: string[] = [];

  let rangeStart;
  for (let idx = 0; idx < sorted.length; idx++) {
    const current = sorted[idx];
    const prev = sorted[idx - 1];

    if (rangeStart && current - prev !== 1) {
      results.push(rangeString(rangeStart, prev));
      rangeStart = current;
    }

    // First
    if (!rangeStart) rangeStart = current;

    // Last
    if (idx === sorted.length - 1) {
      if (rangeStart === current) {
        results.push(rangeString(current));
      } else {
        results.push(rangeString(rangeStart, current));
      }
    }
  }

  return results;
};

export default {
  validate: isValidUnicodeRange,
  validateSync: isValidUnicodeRangeSync,
  parse: parseUnicodeRange,
  parseSync: parseUnicodeRangeSync,
  parseSafe: parseUnicodeRangeSafe,
  parseSafeSync: parseUnicodeRangeSafeSync,
  stringify,
};
