// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  ignores: ['dist', 'node_modules', 'site', '.tmp-vite-scaffold', 'storybook-static'],
}, js.configs.recommended, ...tseslint.configs.recommended, jsxA11y.flatConfigs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite, {
  files: ['**/*.{ts,tsx}'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}, storybook.configs["flat/recommended"]);
