'use strict'

const eloquence = require('eslint-config-eloquence')

module.exports = eloquence({
  target: 'node',
  enableESM: false,
  enableTS: false,
})
