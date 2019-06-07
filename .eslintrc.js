'use strict'

module.exports = {
  root: true,
  extends: ['eloquence/node', 'eloquence/typescript'],
  parserOptions: {
    // By default use modules, the Node configs override to script
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      { allowExpressions: true },
    ],
    '@typescript-eslint/no-empty-interface': 'error',
  },
}
