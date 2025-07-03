export const CODEPOINT_MAX = 0x10FFFF;

export const regexUnicodeRange = /^u\+([0-9a-f]?[0-9a-f?]{1,5})(?:-([0-9a-f?]{1,6}))?$/i;
export const regexTrailingChars = /\?[^?]+$/;

export const createRange = (a: number, b: number) => {
  const arr = [];
  for (let n = a; n <= b; n += 1) {
    arr.push(n);
  }
  return arr;
};

export const getErrorMessage = (
  value: unknown,
  message?: string,
) => `'${String(value)}' is an invalid unicode-range-token.${message ? `\n${message}` : ''}`;
