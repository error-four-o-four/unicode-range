import {
  parseUnicodeRange,
  parseUnicodeRangeSafe,
} from './parse.js';

import { stringify } from './stringify.js';

import { isValidUnicodeRange } from './validate.js';

export {
  isValidUnicodeRange,
  parseUnicodeRange,
  parseUnicodeRangeSafe,
  stringify,
};

export default {
  parse: parseUnicodeRange,
  parseSafe: parseUnicodeRangeSafe,
  stringify,
  validate: isValidUnicodeRange,
};
