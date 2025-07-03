import { parseUnicodeRange } from './parse.js';

export const isValidUnicodeRange = (input: unknown): boolean => {
  if (typeof input !== 'string' && !Array.isArray(input)) return false;

  try {
    parseUnicodeRange(input, false);
  } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return false;
  }

  return true;
};
