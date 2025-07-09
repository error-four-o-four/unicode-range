# @http404/unicode-range

[![NPM-Badge]][NPM]
[![CI-Badge]][CI]
[![Codecov-Badge]][Codecov]

[NPM-Badge]: https://img.shields.io/npm/v/@http404/unicode-range.svg?style=flat-square
[NPM]: https://www.npmjs.com/package/@http404/unicode-range
[CI-Badge]: https://github.com/error-four-o-four/unicode-range/actions/workflows/ci.yml/badge.svg
[CI]: https://github.com/error-four-o-four/unicode-range/actions/workflows/ci.yml
[Codecov-Badge]: https://codecov.io/github/error-four-o-four/unicode-range/graph/badge.svg?token=tHGcN0YF06
[Codecov]: https://codecov.io/github/error-four-o-four/unicode-range

> Unicode parsing made simple, safe, and supercharged! 🚀

@http404/unicode-range is an ECMAScript Module (ESM) JavaScript library designed for parsing, validating, and stringifying [CSS unicode-range](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range) values. It supports unicode-range strings as specified in the [CSS Fonts specification](https://drafts.csswg.org/css-fonts-4/#unicode-range-desc). This package is based on [@japont/unicode-range](https://github.com/Japont/unicode-range) and provides enhanced performance and additional features.

See the added features in our [docs](https://github.com/error-four-o-four/unicode-range/tree/main/docs).

## Install

```bash
npm i @http404/unicode-range
```

> [!NOTE]
> This package is ESM-only and cannot be imported using require() from CommonJS. For more information, see [this guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

## Usage

```js
import UnicodeRange from '@http404/unicode-range';

// Parse ( e.g. U+30-39 -> [30, 31, ..., 39] )
const Hiragana = UnicodeRange
	.parse('U+3041-3096, U+3099-309F')
	.map(cp => String.fromCodePoint(cp));

console.log(Hiragana);

// Stringify ( e.g. [30, 31, ..., 39] -> U+30-39 )
const DigitCodePoints = '0123456789'.split('').map(c => c.codePointAt(0));
const DigitUnicodeRange = UnicodeRange.stringify(DigitCodePoints);

console.log(DigitUnicodeRange);
```

## Contribute

Yes.

## License

MIT License
