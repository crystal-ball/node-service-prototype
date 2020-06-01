'use strict'

const eloquence = require('eslint-config-eloquence')

const configs = eloquence({
  target: 'node',
  esm: false,
})

configs.overrides.map((override) => {
  if (override.files[0] === '*.spec.js') {
    override.parserOptions = { sourceType: 'module' } // eslint-disable-line
  }
  return override
})

module.exports = configs
