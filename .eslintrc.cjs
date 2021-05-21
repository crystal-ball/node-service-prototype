'use strict'

const eloquence = require('eslint-config-eloquence')

const base = eloquence({
  target: 'node',
  enableTS: false,
  rules: {
    'import/no-useless-path-segments': 'off',
  },
})

base.overrides.push({
  files: ['*.cjs'],
  parserOptions: {
    sourceType: 'script',
  },
})

module.exports = base
