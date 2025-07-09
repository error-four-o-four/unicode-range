import { fileURLToPath } from 'node:url';

import dts from 'rollup-plugin-dts';

import pkg from './package.json' with { type: 'json' };
import tsc from './tsconfig.json' with { type: 'json' };

// final output dir
export const dir = `./${pkg.files[0]}`;
// temporary output dir of emitted files
export const tscDir = tsc.compilerOptions.outDir;

// get entrypoints from package.json
const input = Object
  .values(pkg.exports)
  .filter(item => typeof item !== 'string') // remove package.json
  .map((item) => {
    // ./dist/index.js => ./.dist/index.js
    const file = item.import.replace(dir, tscDir);
    // /project/.dist/index.js
    return fileURLToPath(new URL(file, import.meta.url));
  });

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input,
    output: {
      dir,
      format: 'es',
    },
  },
  {
    input: input.map(path => path.replace('.js', '.d.ts')),
    output: {
      dir,
      format: 'es',
    },
    plugins: [dts()],
  },
];
