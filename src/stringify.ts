import { CODEPOINT_MAX, getErrorMessage } from './utils.js';

const isValidInput = (input: number) => {
  if (typeof input !== 'number') return false;

  return (input >= 0 && input <= CODEPOINT_MAX);
};

const rangeString = (start: number, end?: number) => {
  if (!isValidInput(start)) {
    throw new TypeError(getErrorMessage(start));
  }

  if (end === undefined || start === end) {
    return `U+${start.toString(16)}`;
  }

  if (!isValidInput(end)) {
    throw new TypeError(getErrorMessage(start));
  }

  return `U+${start.toString(16)}-${end.toString(16)}`;
};

export const stringifyUnicodeRange = (input: number[]): string[] => {
  const sorted = input.length === 1
    ? input
    : Array.from(new Set(input)).sort((a, b) => a - b);

  const results: string[] = [];

  let rangeStart: number | undefined;

  for (let i = 0; i < sorted.length; i += 1) {
    const current = sorted[i];
    const prev = sorted[i - 1];

    if (typeof rangeStart === 'number' && current - prev !== 1) {
      results.push(rangeString(rangeStart, prev));
      rangeStart = current;
    }

    // First
    rangeStart ??= current;

    // Last
    if (i === sorted.length - 1) {
      if (rangeStart === current) {
        results.push(rangeString(current));
      } else {
        results.push(rangeString(rangeStart, current));
      }
    }
  }

  return results;
};
