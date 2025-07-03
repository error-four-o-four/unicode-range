import {
  CODEPOINT_MAX,
  getErrorMessage,
  regexUnicodeRange,
  regexTrailingChars,
  createRange,
} from './utils.js';

export const parseSingleCodepoint = (input: string): number => {
  const n = parseInt(input, 16);
  if (n > CODEPOINT_MAX) {
    throw new TypeError(getErrorMessage(input));
  }
  return n;
};

export const parseWildcardRange = (input: string): [number, number] => {
  if (regexTrailingChars.test(input)) {
    throw new TypeError(getErrorMessage(input));
  }

  return [
    parseSingleCodepoint(input.replaceAll('?', '0')),
    parseSingleCodepoint(input.replaceAll('?', 'F')),
  ];
};

export const parseIntervalRange = (
  start: string,
  end: string,
): [number, number] => {
  const a = start.includes('?')
    ? parseWildcardRange(start)[0]
    : parseSingleCodepoint(start);

  const b = end.includes('?')
    ? parseWildcardRange(end)[1]
    : parseSingleCodepoint(end);

  if (a > b) {
    throw new TypeError(getErrorMessage(`${start}-${end}`));
  }

  return [a, b];
};

export const parseUnicodeRange = (
  input: string | string[],
  unsorted = false,
): number[] => {
  // it's a single value
  if (typeof input === 'string' && !input.includes(',')) {
    const [, start, end] = regexUnicodeRange.exec(input) ?? [];

    if (start === undefined) {
      throw new TypeError(getErrorMessage(input));
    };

    if (end === undefined) {
      if (start.includes('?')) {
        return createRange(...parseWildcardRange(start));
      } else {
        return [parseSingleCodepoint(start)];
      }
    }

    return createRange(...parseIntervalRange(start, end));
  }

  // there are multiple values
  const array = Array.isArray(input) ? input : input.split(',');
  const result = new Set<number>();

  let a: number;
  let b: number;

  for (const value of array) {
    const [, start, end] = regexUnicodeRange.exec(value.trim()) ?? [];

    if (start === undefined) {
      throw new TypeError(getErrorMessage(value));
    };

    if (end === undefined) {
      if (start.includes('?')) {
        [a, b] = parseWildcardRange(start);
        for (let n = a; n <= b; n += 1) {
          result.add(n);
        }
        continue;
      }

      result.add(parseSingleCodepoint(start));
      continue;
    }

    [a, b] = parseIntervalRange(start, end);
    for (let n = a; n <= b; n += 1) {
      result.add(n);
    }
  }

  return unsorted || array.length === 1
    ? Array.from(result)
    : Array.from(result).sort((a, b) => a - b);
};

export const parseUnicodeRangeSafe = (
  input: unknown,
  unsorted = false,
): number[] => {
  if (typeof input !== 'string' && !Array.isArray(input)) return [];

  try {
    return parseUnicodeRange(input, unsorted);
  } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars

    // if (process?.env?.NODE_ENV === 'test') return [];

    // console.warn(
    //   `Failed to parse unicode-range: ${
    //     (error instanceof Error)
    //       ? error.message
    //       : String(error) || 'Unhandled'
    //   }`,
    // );
  }

  return [];
};
