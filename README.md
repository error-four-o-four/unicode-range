# @http404/unicode-range

<!--
[![NPM-Badge]][NPM]
[![Codecov-Badge]][Codecov]

[NPM-Badge]: https://img.shields.io/npm/v/@http404/unicode-range.svg?style=flat-square
[NPM]: https://www.npmjs.com/package/@http404/unicode-range
[Codecov-Badge]: https://img.shields.io/codecov/c/github/Japont/unicode-range.svg?style=flat-square
[Codecov]: https://codecov.io/gh/Japont/unicode-range
-->

> Unicode-range parser/builder.

## Install

```bash
npm i @http404/unicode-range
# - OR -
yarn add @http404/unicode-range
```

<!--

## Usage

```js
import { UnicodeRange } from '@http404/unicode-range';

// Parse ( e.g. U+30-39 -> [30, 31, ..., 39] )
const HiraganaUnicodeRangeList = ['U+3041-3096', 'U+3099-309F'];
const HiraganaCodePointList = UnicodeRange.parse(HiraganaUnicodeRangeList);
const Hiragana = HiraganaCodePointList.map(cp => String.fromCodePoint(cp)));
console.log(Hiragana);

// Stringify ( e.g. [30, 31, ..., 39] -> U+30-39 )
const Digit = '0123456789';
const DigitCodePointList = Digit.split('').map(c => c.codePointAt(0));
const DigitUnicodeRangeList = UnicodeRange.stringify(DigitCodePointList);
console.log(NumericUnicodeRangeList);
```

## Contribute

PRs accepted.

-->

## License

MIT (c)
