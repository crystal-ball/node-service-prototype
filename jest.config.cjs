'use strict'

const { ENABLE_JEST_NOTIFICATIONS, JEST_COLLECT_COVERAGE, TEST_SUITE } = process.env

module.exports = {
  // Provides nice test output of what's being run
  verbose: true,

  // It's a Node project 😇
  testEnvironment: 'node',

  // OS notifications of test results is an opt in feature, enable by setting
  // a truthy env value in your shell environment
  notify: Boolean(ENABLE_JEST_NOTIFICATIONS),

  // Collect test coverage of source files (excluding stories), report
  // text-summary for devs and lcov for reporting to Code Climate in CI/CD envs.
  collectCoverage: Boolean(JEST_COLLECT_COVERAGE),
  coverageReporters: ['text-summary', 'lcov'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageProvider: 'v8',

  transform: {
    // Jest doesn't support ESM yet so we use Babel to compile for testing
    '\\.[jt]sx?$': 'babel-jest',
  },

  globalSetup: TEST_SUITE === 'acceptance' ? './test/setup/global-setup.cjs' : undefined,
}
