// ESLint flat config (ESLint 9+)
// Minimal rules for Phase 0 — expanded in later phases.

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off', // TypeScript handles this
    },
  },
];
