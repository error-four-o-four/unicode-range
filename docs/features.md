
## Usage

The package provides multiple entry points for different usage scenarios.

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
// global 'UnicodeRange'
import '@http404/unicode-range/global';
UnicodeRange.parse('U+0-F');
```

## Added Features

The package includes the functions `parseUnicodeRangeSafe` and `stringifyUnicodeRangeSafe`, which return an empty array instead of throwing a TypeError on invalid input.

The function `isValidUnicodeRange` returns a boolean indicating whether the input is a valid unicode-range string.

The `parseUnicodeRange` function accepts a single string argument, which may contain multiple comma-separated values (e.g., 'U+0, U+9'). By default, it returns a deduplicated and sorted array of code points. To disable sorting and improve performance, an optional boolean can be provided as the second argument.

```js
UnicodeRange.parse('U+99-9F, U+41-96');
// [65, 66, 67, ..., 150, 153, 154, 155, ..., 159]

UnicodeRange.parse('U+99-9F, U+41-96', true);
// [153, 154, 155, ..., 159, 65, 66, 67, ..., 150]
```

## Benchmark

In comparison to [@japont/unicode-range](https://github.com/Japont/unicode-range), this package demonstrates slightly improved performance.

<!-- auto-generated-start bench-results parse -->
### single codepoint

 value `U+10ABCD`                     | Latency avg (ns) | Throughput avg (ops/s) | Samples 
--------------------------------------|------------------|------------------------|---------
 @http404 parseUnicodeRange(value);   | 226.66 ± 0.86%   | 4989494 ± 0.02%        | 4411943 
 @japont UnicodeRange.parse([value]); | 341.23 ± 0.24%   | 3082343 ± 0.02%        | 2930574 

### wildcard range

 value `U+10????`                     | Latency avg (ns) | Throughput avg (ops/s) | Samples 
--------------------------------------|------------------|------------------------|---------
 @http404 parseUnicodeRange(value);   | 1143717 ± 2.47%  | 1010 ± 1.00%           | 2186    
 @japont UnicodeRange.parse([value]); | 10390178 ± 1.75% | 98 ± 1.42%             | 241     

### interval range

 value `U+10ABCD-10FFFF`              | Latency avg (ns) | Throughput avg (ops/s) | Samples 
--------------------------------------|------------------|------------------------|---------
 @http404 parseUnicodeRange(value);   | 202297 ± 1.57%   | 5834 ± 0.33%           | 12359   
 @japont UnicodeRange.parse([value]); | 1921909 ± 1.87%  | 553 ± 0.97%            | 1301    

### multiple single codepoints

 value `U+0, U+0f`                                               | Latency avg (ns) | Throughput avg (ops/s) | Samples 
-----------------------------------------------------------------|------------------|------------------------|---------
 @http404 value.split(/,\s*/g).map(v => parseUnicodeRange(v));   | 434.77 ± 0.85%   | 2542194 ± 0.01%        | 5750633 
 @http404 parseUnicodeRange(value);                              | 562.94 ± 1.21%   | 1867043 ± 0.01%        | 4440994 
 @japont value.split(/,\s*/g).map(v => UnicodeRange.parse([v])); | 685.07 ± 0.59%   | 1553504 ± 0.01%        | 3649276 
 @japont UnicodeRange.parse(value.split(/,\s*/g));               | 765.54 ± 1.78%   | 1423105 ± 0.01%        | 3265776 

### multiple wildcard ranges

 value `u+a?, u+b??`                                             | Latency avg (ns) | Throughput avg (ops/s) | Samples 
-----------------------------------------------------------------|------------------|------------------------|---------
 @http404 value.split(/,\s*/g).map(v => parseUnicodeRange(v));   | 2084.2 ± 0.45%   | 515987 ± 0.02%         | 1199478 
 @http404 parseUnicodeRange(value);                              | 13419 ± 0.58%    | 80943 ± 0.05%          | 186310  
 @japont value.split(/,\s*/g).map(v => UnicodeRange.parse([v])); | 23099 ± 0.12%    | 43770 ± 0.05%          | 108230  
 @japont UnicodeRange.parse(value.split(/,\s*/g));               | 26134 ± 0.48%    | 40446 ± 0.06%          | 95661   

### multiple interval ranges

 value `U+aaa-ccc, U+aacc-aadd`                                  | Latency avg (ns) | Throughput avg (ops/s) | Samples 
-----------------------------------------------------------------|------------------|------------------------|---------
 @http404 value.split(/,\s*/g).map(v => parseUnicodeRange(v));   | 2680.5 ± 0.70%   | 406718 ± 0.02%         | 932659  
 @http404 parseUnicodeRange(value);                              | 27669 ± 0.62%    | 39317 ± 0.07%          | 90364   
 @japont UnicodeRange.parse(value.split(/,\s*/g));               | 28043 ± 0.56%    | 37704 ± 0.06%          | 89149   
 @japont value.split(/,\s*/g).map(v => UnicodeRange.parse([v])); | 28100 ± 0.42%    | 37030 ± 0.06%          | 88969   

### multiple mixed values

 value `U+0, U+00, U+aaa-ccc, U+aacc-aadd, u+a?, u+b??`          | Latency avg (ns) | Throughput avg (ops/s) | Samples 
-----------------------------------------------------------------|------------------|------------------------|---------
 @http404 value.split(/,\s*/g).map(v => parseUnicodeRange(v));   | 4837.5 ± 0.41%   | 213849 ± 0.03%         | 516799  
 @http404 parseUnicodeRange(value);                              | 32574 ± 0.60%    | 32832 ± 0.07%          | 76749   
 @japont UnicodeRange.parse(value.split(/,\s*/g));               | 45265 ± 0.43%    | 23057 ± 0.08%          | 55231   
 @japont value.split(/,\s*/g).map(v => UnicodeRange.parse([v])); | 52049 ± 0.48%    | 19948 ± 0.08%          | 48032   

<!-- auto-generated-end bench-results -->