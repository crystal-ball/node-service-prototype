'use strict'

const pino = require('pino')

// http://getpino.io
// https://github.com/pinojs/pino-pretty

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

const options = {
  name: 'node-service-prototype',
  prettifier: null,
}

if (process.env.NODE_ENV !== 'production') {
  options.prettyPrint = {
    colorize: true,
    translateTime: 'h:MM:ss',
    ignore: 'name,pid,hostname,req_id',
  }
  options.prettifier = require('pino-pretty')
}

const logger = pino(options)

/**
 * Handle initializing logger for current service instance env
 */
const initializeLogger = async () => ({
  logger,
})

module.exports = { initializeLogger, logger }
