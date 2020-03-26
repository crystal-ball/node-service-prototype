/* eslint-disable max-params */

'use strict'

/**
 * Service error handlers middleware handle returning sanitized error responses
 * to ensure service internal operation details aren't exposed to hackers 😉
 * @module
 */

const { customErrorCodes } = require('../errors')

/**
 * Handle known service errors intentionally thrown in the code with a sanitized
 * response. (No additional error logging required as these are intentional req
 * failures)
 */
const serviceErrorsHandler = (err, req, res, next) => {
  // If we're already writing res, then we must delegate to default Express
  // error handler to close connection and fail request
  if (res.headersSent) return next(err)

  switch (err.code) {
    case customErrorCodes.unauthorized:
      return res.status(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization required',
        },
      })

    case customErrorCodes.forbidden:
      return res.status(403).send({
        error: {
          code: 'FORBIDDEN',
          message: 'Permission denied',
        },
      })

    default:
      return next(err)
  }
}

// Ref: https://github.com/expressjs/body-parser#errors
const bodyParserErrorTypes = [
  'entity.parse.failed',
  'encoding.unsupported',
  'request.aborted',
  'entity.too.large',
  'request.size.invalid',
  'stream.encoding.set',
  'parameters.too.many',
  'charset.unsupported',
  'encoding.unsupported',
]

/**
 * Handle error thrown by bodyParser module. (They're setup with an `expose` flag
 * to signal if the error message is safe to pass through to client.)
 */
const bodyParserErrorHandler = (err, req, res, next) => {
  // If we're already writing res, then we must delegate to default Express
  // error handler to close connection and fail request
  if (res.headersSent) return next(err)
  if (err.expose !== true || !bodyParserErrorTypes.includes(err.type)) return next(err)

  return res.status(err.statusCode || 400).send({
    error: {
      code: 'INVALID_REQUEST',
      message: err.message,
    },
  })
}

/**
 * Final error handler for unknown errors that occur, aka something has gone
 * wrong unintentionally! 😬 Log the complete error details and then send a
 * generic internal server error.
 */
const unknownErrorHandler = (err, req, res, next) => {
  // If we're already writing res, then we must delegate to default Express
  // error handler to close connection and fail request
  if (res.headersSent) return next(err)

  req.log.fatal({ err }, `💥 ${err.message}` || 'Fatal error 💥')

  return res.status(500).send({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  })
}

const initalizeErrorHandlers = async (app) => {
  app.use(serviceErrorsHandler)
  app.use(bodyParserErrorHandler)
  app.use(unknownErrorHandler)
}

module.exports = {
  serviceErrorsHandler,
  bodyParserErrorHandler,
  unknownErrorHandler,
  initalizeErrorHandlers,
}
