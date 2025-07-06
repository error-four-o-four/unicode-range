import {
  parseUnicodeRange,
  parseUnicodeRangeSafe,
} from './parse.js';

import {
  stringifyUnicodeRange,
  stringifyUnicodeRangeSafe,
} from './stringify.js';

import { isValidUnicodeRange } from './validate.js';

export {
  isValidUnicodeRange,
  parseUnicodeRange,
  parseUnicodeRangeSafe,
  stringifyUnicodeRange,
};

export default {
  parse: parseUnicodeRange,
  parseSafe: parseUnicodeRangeSafe,
  stringify: stringifyUnicodeRange,
  stringifySafe: stringifyUnicodeRangeSafe,
  validate: isValidUnicodeRange,
};
