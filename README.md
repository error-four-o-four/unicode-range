# @http404/unicode-range

<!--
[![NPM-Badge]][NPM]
[![Codecov-Badge]][Codecov]

[NPM-Badge]: https://img.shields.io/npm/v/@http404/unicode-range.svg?style=flat-square
[NPM]: https://www.npmjs.com/package/@http404/unicode-range
[Codecov-Badge]: https://img.shields.io/codecov/c/github/Japont/unicode-range.svg?style=flat-square
[Codecov]: https://codecov.io/gh/Japont/unicode-range
-->

@http404/unicode-range is an ESM-only JavaScript library for parsing, validating, and stringifying [CSS unicode-range](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range) values. It supports the common unicode-range strings as described in the [CSS Fonts specification](https://drafts.csswg.org/css-fonts-4/#unicode-range-desc). The package is based on the original [@Japont/unicode-range](https://github.com/Japont/unicode-range) but offers improved performance and functionality.

## Install

```bash
npm i @http404/unicode-range
```

> [!IMPORTANT]
> This package is ESM-only. It cannot be require()'d from CommonJS. [Read More](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

## Usage

This package provides separate entry points.

```js
// default
import UnicodeRange from '@http404/unicode-range';
UnicodeRange.parse('U+0-F');
```

```js
// named
import { parseUnicodeRange } from '@http404/unicode-range';
parseUnicodeRange('U+0-F');
```

```js
// global 'UnicodeParser'
import '@http404/unicode-range/global';
UnicodeRange.parse('U+0-F');
```

## Added Functionality

@todo

## Benchmark

<!-- auto-generated-start bench-results parse -->
### single codepoint

 value `U+10ABCD`                     | Latency avg (ns) | Throughput avg (ops/s) | Samples 
--------------------------------------|------------------|------------------------|---------
 @http404 parseUnicodeRange(value);   | 256.30 ± 1.20%   | 4610064 ± 0.02%        | 3901668 
 @japont UnicodeRange.parse([value]); | 364.07 ± 0.18%   | 2894613 ± 0.01%        | 2746709 

### wildcard range

 value `U+10????`                     | Latency avg (ns) | Throughput avg (ops/s) | Samples 
--------------------------------------|------------------|------------------------|---------
 @http404 parseUnicodeRange(value);   | 1205461 ± 2.37%  | 946 ± 0.98%            | 2074    
 @japont UnicodeRange.parse([value]); | 11566469 ± 3.01% | 89 ± 1.66%             | 217     

### interval range

 value `U+10ABCD-10FFFF`              | Latency avg (ns) | Throughput avg (ops/s) | Samples 
--------------------------------------|------------------|------------------------|---------
 @http404 parseUnicodeRange(value);   | 221010 ± 1.67%   | 5368 ± 0.35%           | 11312   
 @japont UnicodeRange.parse([value]); | 2096077 ± 1.95%  | 507 ± 1.01%            | 1193    

### multiple single codepoints

 value `U+0, U+0f`                                               | Latency avg (ns) | Throughput avg (ops/s) | Samples 
-----------------------------------------------------------------|------------------|------------------------|---------
 @http404 value.split(/,\s*/g).map(v => parseUnicodeRange(v));   | 463.13 ± 1.19%   | 2345905 ± 0.01%        | 5398100 
 @http404 parseUnicodeRange(value);                              | 695.23 ± 1.10%   | 1545070 ± 0.01%        | 3595924 
 @japont value.split(/,\s*/g).map(v => UnicodeRange.parse([v])); | 790.80 ± 0.53%   | 1380958 ± 0.01%        | 3161368 
 @japont UnicodeRange.parse(value.split(/,\s*/g));               | 811.25 ± 1.32%   | 1345320 ± 0.01%        | 3081658 

### multiple wildcard ranges

 value `u+a?, u+b??`                                             | Latency avg (ns) | Throughput avg (ops/s) | Samples 
-----------------------------------------------------------------|------------------|------------------------|---------
 @http404 value.split(/,\s*/g).map(v => parseUnicodeRange(v));   | 2382.2 ± 1.45%   | 462638 ± 0.02%         | 1049455 
 @http404 parseUnicodeRange(value);                              | 15690 ± 0.91%    | 71584 ± 0.07%          | 159334  
 @japont value.split(/,\s*/g).map(v => UnicodeRange.parse([v])); | 25817 ± 0.11%    | 39273 ± 0.06%          | 96834   
 @japont UnicodeRange.parse(value.split(/,\s*/g));               | 29071 ± 0.46%    | 36186 ± 0.07%          | 85995   

### multiple interval ranges

 value `U+aaa-ccc, U+aacc-aadd`                                  | Latency avg (ns) | Throughput avg (ops/s) | Samples 
-----------------------------------------------------------------|------------------|------------------------|---------
 @http404 value.split(/,\s*/g).map(v => parseUnicodeRange(v));   | 3095.6 ± 0.71%   | 367551 ± 0.02%         | 807695  
 @japont value.split(/,\s*/g).map(v => UnicodeRange.parse([v])); | 30462 ± 0.47%    | 34329 ± 0.07%          | 82069   
 @japont UnicodeRange.parse(value.split(/,\s*/g));               | 30490 ± 0.49%    | 34655 ± 0.07%          | 81993   
 @http404 parseUnicodeRange(value);                              | 30949 ± 0.70%    | 35400 ± 0.08%          | 80779   

### multiple mixed values

 value `U+0, U+00, U+aaa-ccc, U+aacc-aadd, u+a?, u+b??`          | Latency avg (ns) | Throughput avg (ops/s) | Samples 
-----------------------------------------------------------------|------------------|------------------------|---------
 @http404 value.split(/,\s*/g).map(v => parseUnicodeRange(v));   | 5514.5 ± 0.37%   | 191480 ± 0.03%         | 453349  
 @http404 parseUnicodeRange(value);                              | 36796 ± 0.53%    | 28877 ± 0.09%          | 67943   
 @japont UnicodeRange.parse(value.split(/,\s*/g));               | 50552 ± 0.65%    | 20986 ± 0.10%          | 49455   
 @japont value.split(/,\s*/g).map(v => UnicodeRange.parse([v])); | 58248 ± 0.59%    | 17906 ± 0.10%          | 42920   

<!-- auto-generated-end bench-results -->

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

-->

## Contribute

Yes.


## License

MIT (c)
