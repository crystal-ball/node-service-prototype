'use strict'

const pino = require('pino')
const expressPinoLogger = require('express-pino-logger')

// ℹ️ Logging should only route to stdout/stderr per Docker best practices,
// Transport to consumers should be handled separately

// TODO: custom formatting of error mesages, especially in dev, to include
// emojis for extra awesomeness

// TODO: provide an options param for logging metadata?

// Ideal logging ability:
// 1. Log incoming request in entirety, with ability to mask sensitive user input
// 2. Log info for requests, tied to that request id (may be possible with a
//    a transform that removes the req info from 'INFO' logs??)
// 3. Logs can have metadata setting level and tags, when creating the logger
//    default metadata is set
// 4. On response, the entire response is logged, with ability to mask sensitive
//    response output

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
