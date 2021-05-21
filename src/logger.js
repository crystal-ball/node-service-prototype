import pino from 'pino'
import prettyPrint from 'pino-pretty'

import { DEVELOPMENT } from './configs.js'

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

// Setup pretty printing for logs outside of production
if (DEVELOPMENT) {
  const prettifier = prettyPrint({
    colorize: true,
    translateTime: 'h:MM:ss',
    ignore: 'name,pid,hostname,req_id',
  })

  options.level = 20

  // Pino will not pretty print if this config object isn't present ¯\_(ツ)_/¯
  options.prettyPrint = {}
  // The pino prettifier accepts a factory fn that is called with the values set
  // in options.prettyPrint. The returned fn is called for log prettifying.
  // Service wraps pino-pretty with some additional custom formatting (so that
  // an entire custom prettifier isn't needed)
  options.prettifier = () => (rawLog) =>
    prettifier(rawLog).replace(
      // Note that info and warn have an extra space from the ignored hostname/pid info
      /INFO\s|WARN\s|DEBUG|ERROR|FATAL/,
      (matchedLevel) =>
        ({
          // Remove extra space between INFO and :
          'INFO ': 'INFO',
          'ERROR': '💥 ERROR',
          // These emoji require two spaces to look correct
          'DEBUG': 'ℹ️  DEBUG',
          'WARN ': '⚠️  WARN',
          'FATAL': '☢️  FATAL',
        }[matchedLevel]),
    )
}

export const logger = pino(options)

/**
 * Handle initializing logger for current service instance env
 */
export async function initializeLogger() {
  return {
    logger,
  }
}
