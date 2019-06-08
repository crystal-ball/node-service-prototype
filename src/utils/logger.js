'use strict'

const logger = {}

/**
 * Setup the logger for current service instance env
 */
const setupLogger = async () => {
  /* eslint-disable no-console */
  /**
   * Logger conventions:
   *
   * TODO
   */
  logger.log = (...args) => console.log(...args)
  logger.error = (...args) => console.error(...args)
  /* eslint-enable no-console */
  return logger
}

module.exports = { setupLogger, logger }
