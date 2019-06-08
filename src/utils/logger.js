'use strict'

const pino = require('pino')
const expressPinoLogger = require('express-pino-logger')

const options = {}
if (process.env.NODE_ENV !== 'production') {
  options.prettyPrint = {
    colorize: true,
    translateTime: true,
  }
}

const logger = pino(options)

/**
 * Handle initializing logger for current service instance env
 */
const initializeLogger = async () => ({
  expressLogger: expressPinoLogger({ logger }),
  logger,
})

module.exports = { initializeLogger, logger }
