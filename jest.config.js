'use strict'

module.exports = {
  verbose: true,
  testEnvironment: 'node',

  // 😢 https://github.com/facebook/jest/issues/8036
  // notify: !!process.env.JEST_NOTIFY,

  // Opt in to collect coverage with a text-summary of results
  collectCoverage: !!process.env.JEST_COLLECT_COVERAGE,
  coverageReporters: ['text-summary'],
  collectCoverageFrom: ['src/**/*.js'],
}
