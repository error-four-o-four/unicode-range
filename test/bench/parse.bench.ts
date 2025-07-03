import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { relative } from 'node:path';

import { UnicodeRange } from '@japont/unicode-range';

import { parseUnicodeRange } from '../../src/parse.js';

import {
  createBench,
  createCustomResult,
} from '../bench.utils.js';

import type {
  CustomSample,
  CustomResult,
} from '../bench.utils.js';

const japont = '@japont';
const http404 = '@http404';

const benchmarks = {
  single: {
    values: ([
      ['single codepoint', 'U+10ABCD', 1000],
      ['wildcard range', 'U+10????'],
      ['interval range', 'U+10ABCD-10FFFF'],
    ] as CustomSample[]),
    results: ([] as CustomResult[]),
    async runner(
      name: string,
      value: string,
      time = 2500,
    ) {
      const bench = createBench(name, time);

      bench.add(
        `${japont} UnicodeRange.parse([value]);`,
        () => void UnicodeRange.parse([value]),
      );

      bench.add(
        `${http404} parseUnicodeRange(value);`,
        () => void parseUnicodeRange(value),
      );

      await bench.run();

      this.results.push(createCustomResult(name, value, bench));
    },
  },
  multiple: {
    values: ([
      ['multiple single codepoints', 'U+0, U+0f'],
      ['multiple wildcard ranges', 'u+a?, u+b??'],
      ['multiple interval ranges', 'U+aaa-ccc, U+aacc-aadd'],
      ['multiple mixed values', 'U+0, U+00, U+aaa-ccc, U+aacc-aadd, u+a?, u+b??'],
    ] as CustomSample[]),
    results: [] as CustomResult[],
    async runner(
      name: string,
      value: string,
      time = 2500,
    ) {
      const bench = createBench(name, time);

      bench.add(
        String.raw`${japont} UnicodeRange.parse(value.split(/,\s*/g));`,
        () => void UnicodeRange.parse(value.split(/,\s*/g)),
      );

      bench.add(
        String.raw`${japont} value.split(/,\s*/g).map(v => UnicodeRange.parse([v]));`,
        () => void value.split(/,\s*/g).map(v => UnicodeRange.parse([v])),
      );

      bench.add(
        `${http404} parseUnicodeRange(value);`,
        () => void parseUnicodeRange(value),
      );

      bench.add(
        String.raw`${http404} value.split(/,\s*/g).map(v => parseUnicodeRange(v));`,
        () => void value.split(/,\s*/g).map(v => parseUnicodeRange(v)),
      );

      await bench.run();

      this.results.push(createCustomResult(name, value, bench));
    },
  },
};

console.log('Running `parse` benchmark tests ...');

await Promise.all([
  ...benchmarks.single.values.map(args => benchmarks.single.runner(...args)),
  ...benchmarks.multiple.values.map(args => benchmarks.multiple.runner(...args)),
]);

const results = Object
  .values(benchmarks)
  .map(bench => bench.results)
  .flat();

const sorted = [
  ...benchmarks.single.values.map(sample => sample[0]),
  ...benchmarks.multiple.values.map(sample => sample[0]),
].reduce((all, name) => {
  const result = results.find(result => result.name.startsWith(name));

  if (!result) {
    console.warn('Could not find %o', name);
    return all;
  };

  return [
    ...all,
    result,
  ];
}, [] as CustomResult[]);

const file = fileURLToPath(new URL('parse.json', import.meta.url));
await writeFile(file, JSON.stringify(sorted, null, 2), 'utf-8');
console.log('Written data to %o', relative(process.cwd(), file));
