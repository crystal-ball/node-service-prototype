'use strict'

module.exports = {
  root: true,
  extends: 'eloquence/node',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'import/extensions': ['error', 'ignorePackages'],
  },
}
