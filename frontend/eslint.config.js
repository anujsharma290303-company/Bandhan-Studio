/**
 * ESLint Configuration - Code Quality and Style Rules
 * Enforces TypeScript best practices, React hooks rules, and code standards
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore dist folder from linting
  globalIgnores(['dist']),
  {
    // Apply rules to all TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,                    // JavaScript best practices
      tseslint.configs.recommended,              // TypeScript best practices
      reactHooks.configs.flat.recommended,       // React Hooks rules
      reactRefresh.configs.vite,                 // Vite Fast Refresh rules
    ],
    languageOptions: {
      ecmaVersion: 2020,                         // ES2020 syntax support
      globals: globals.browser,                  // Browser global variables
    },
  },
])
