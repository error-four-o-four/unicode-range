import { parseUnicodeRangeSync } from './parse.js';
import { parseUnicodeRange } from './promise.js';

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
