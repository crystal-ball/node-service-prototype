/* eslint-disable max-params */

/**
 * Service request+response logging middleware creates a child logger for each
 * incoming req with a unique req_id that can be used to link logs together.
 * Request child logger is attached at `req.log` and should be used throughout
 * that request.
 *
 * @module
 */

import pino from 'pino'
import nanoid from 'nanoid'

import { logger } from '../logger.mjs'

const logMeta = Symbol('logMeta')

/**
 * Handle logging the response data and cleaning up listener
 */
function resLogger() {
  // Ref: https://github.com/pinojs/pino-http/blob/master/logger.js
  this.removeListener('finish', resLogger)

  const { log, startTime } = this[logMeta]

  const logLevel = this.statusCode >= 500 ? 'error' : 'info'
  const responseTime = Date.now() - startTime

  log[logLevel](
    {
      // Using the pino res serializer for now to create basic res info
      ...pino.stdSerializers.res(this),
      responseTime,
      // TODO: can the res.body be logged?
    },
    `RES ${this.statusCode} ${this.statusMessage}`,
  )
}

/**
 * Handle creating and attaching child logger with unique id to each request
 * context for linked log messages.
 */
export function reqLogger(req, res, next) {
  // http://getpino.io/#/docs/child-loggers
  const log = logger.child({ req_id: nanoid() })
  req.log = log

  // Attach logMeta needed later for creating res log
  res[logMeta] = {
    log,
    startTime: Date.now(),
  }

  req.log.info(
    {
      method: req.method,
      url: req.url,
      headers: req.headers,
    },
    `REQ ${req.method} ${req.originalUrl}`,
  )

  res.on('finish', resLogger)

  if (next) next()
}

/**
 * TODO: use a better prettifier for dev:
 * - Don't output host data
 * - In dev don't output req_id
 * - Use short date format
 *
 * [hh:mm:ss] {level}: {message}/n
 * JSON stringified log data
 *
 * Setup a verbose env var to output all data with prettifier
 */
