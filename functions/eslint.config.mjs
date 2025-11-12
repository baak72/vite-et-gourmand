import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: globals.node,
    },
    extends: [js.configs.recommended],
    rules: {
      quotes: ['error', 'double', { allowTemplateLiterals: true }],
      'prefer-arrow-callback': 'error',
    },
  },
]);