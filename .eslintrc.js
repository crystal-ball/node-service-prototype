'use strict'

module.exports = {
  root: true,
  extends: 'eloquence/node',
  overrides: [
    {
      files: ['**/*.spec.js'],
      rules: {
        'import/first': 'off',
      },
    },
  ],
}
