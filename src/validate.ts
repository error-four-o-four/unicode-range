import { parseIntervalRange } from './parse.js';

import { CODEPOINT_MAX, regexTrailingChars, regexUnicodeRange } from './utils.js';

export const isValidUnicodeRange = (input: unknown): boolean => {
  if (typeof input !== 'string' && !Array.isArray(input)) return false;

  const array = Array.isArray(input)
    ? input
    : input.includes(',')
      ? input.split(',')
      : [input];

  for (const value of array) {
    if (typeof value !== 'string') return false;

    const [, start, end] = regexUnicodeRange.exec(value.trim()) ?? [];

    if (start === undefined) return false;

    if (end === undefined) {
      if (start.includes('?') && regexTrailingChars.test(start)) return false;

      if (parseInt(start, 16) > CODEPOINT_MAX) return false;

      continue;
    }

    try {
      parseIntervalRange(start, end);
    } catch (error) {
      if (error instanceof TypeError) return false;

      throw error;
    }
  }

  return true;
};
