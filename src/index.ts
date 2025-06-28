// https://github.com/Japont/unicode-range
// https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range
// https://drafts.csswg.org/css-fonts-4/#unicode-range-desc

import {
  parseUnicodeRangeSync,
  parseUnicodeRangeSafeSync,
} from './parse.js';

import {
  stringify,
} from './stringify.js';

export {
  parseUnicodeRangeSync,
  parseUnicodeRangeSafeSync,
  stringify,
};

export default {
  parseSync: parseUnicodeRangeSync,
  parseSafeSync: parseUnicodeRangeSafeSync,
  stringify,
};
