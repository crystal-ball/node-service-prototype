'use strict'

/**
 * Service logger
 */
const logger = {
  log: () => {},
  error: () => {},
}

/**
 * Handle initializing logger for current service instance env
 */
const initializeLogger = async () => {
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

module.exports = { initializeLogger, logger }
