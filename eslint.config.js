import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // --- Clean Code: funções pequenas e focadas ---
      'max-lines-per-function': [
        'warn',
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      'max-depth': ['warn', 3],
      'max-params': ['warn', 4],
      'complexity': ['warn', 10],

      // --- Clean Code: nomes claros, sem código morto ---
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',
      'no-unused-expressions': 'warn',
      'no-lonely-if': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',

      // --- Clean Code: sem efeitos colaterais ocultos ---
      'no-param-reassign': 'warn',
      'no-return-assign': 'warn',

      // --- Organização ---
      'no-duplicate-imports': 'warn',
    },
  },
])
