export const CODEPOINT_MAX = 0x10FFFF;
export const MAX_RANGE_LIMIT = 0x10000; // 65536 codepoints

export const regexUnicodeRange = /^u\+([0-9a-f]?[0-9a-f?]{1,5})(?:-([0-9a-f?]{1,6}))?$/i;
export const regexTrailingChars = /\?[^?]+$/;

export const createRange = (a: number, b: number) => {
  if (b - a + 1 > MAX_RANGE_LIMIT) {
    throw new RangeError(`Unicode range exceeds reasonable size '${MAX_RANGE_LIMIT}'`);
  }

  return Array.from({ length: b - a + 1 }).map((_, i) => a + i);
};

export const createSet = (a: number, b: number) => {
  if (b - a + 1 > MAX_RANGE_LIMIT) {
    throw new RangeError(`Unicode range exceeds reasonable size '${MAX_RANGE_LIMIT}'`);
  }

  const set = new Set<number>();

  for (let i = a; i <= b; i += 1) {
    set.add(i);
  }

  return set;
};

export const getErrorMessage = (value: unknown) => `'${String(value)}' is an invalid unicode-range-token`;

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
