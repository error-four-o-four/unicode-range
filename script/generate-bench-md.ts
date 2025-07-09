import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';

import resultsParse from '../test/bench/parse.json' with { type: 'json' };

const featuresFile = fileURLToPath(new URL('../docs/features.md', import.meta.url));
const featuresText = (await readFile(featuresFile, 'utf8')).split('\n').map(line => line.trim());

type BenchResult = (typeof resultsParse)[number];

type Fields = (keyof Pick<
  BenchResult['tasks'][number],
  | 'Latency avg (ns)'
  | 'Throughput avg (ops/s)'
  | 'Samples'
>)[];

const createTableLines = (result: BenchResult) => {
  const fields = [
    'Latency avg (ns)',
    'Throughput avg (ops/s)',
    'Samples',
  ] satisfies Fields;

  const input = [
    [`value \`${result.value}\``, ...fields],
    ...result.tasks.map(task => [
      task['Task name'],
      ...fields.map(field => String(task[field])),
    ]),
  ];

  const heading = `### ${result.name}`;

  const paddings = input[0]
    .map((_, i) => input.map(col => col[i]))
    .map(cols => cols.reduce(
      (acc, col) => col.length > acc ? col.length : acc, -Infinity),
    );

  const line = `-${paddings
    .map(pad => Array.from({ length: pad }, () => '-').join(''))
    .join('-|-')
  }-`;

  const table = input
    .map(line => line
      .map((col, i) => col.padEnd(paddings[i]))
      .join(' | '),
    ).map(line => ` ${line} `);

  return [
    heading,
    '',
    table[0],
    line,
    ...table.slice(1),
    '',
  ];
};

const getIndices = (lines: string[], search: string): [number, number] | undefined => {
  const searchStart = `<!-- auto-generated-start bench-results ${search} -->`;
  const searchEnd = `<!-- auto-generated-end bench-results -->`;

  const start = lines.indexOf(searchStart);

  if (!start) return;

  const end = lines.indexOf(searchEnd, start);

  return !end ? undefined : [start, end];
};

// main

const tablesParse = resultsParse.map(result => createTableLines(result)).flat();
const indicesParse = getIndices(featuresText, 'parse');

if (!indicesParse) {
  throw Error('Nope');
}

const content = [
  ...featuresText.slice(0, indicesParse[0] + 1),
  ...tablesParse,
  ...featuresText.slice(indicesParse[1]),
].join('\n');

await writeFile(featuresFile, content, 'utf8');
