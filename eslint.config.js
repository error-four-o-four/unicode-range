import { fileURLToPath } from 'node:url';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

import { includeIgnoreFile } from '@eslint/compat';

export default tseslint.config(
  includeIgnoreFile(fileURLToPath(new URL('.gitignore', import.meta.url))),
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: false,
  }),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      // 'curly': ['error', 'multi-line'],
      // '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    },
  },
  {
    files: [
      'script/**/*.ts',
      'test/**/*.ts',
      '**/*.config.js',
      '**/*.config.ts',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
);
