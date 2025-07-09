import { rmSync, type RmOptions } from 'node:fs';

import { tscDir, dir } from '../rollup.config.js';

const options: RmOptions = {
  recursive: true,
  force: true,
};

rmSync(tscDir, options);
rmSync(dir, options);
