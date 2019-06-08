'use strict'

const { logger } = require('../utils/logger')

/**
 * Service error handler will log the complete error details before sending a
 * sanitized error response to the client.
 */
const errorHandler = (err, req, res, next) => {
  // If we're already writing res, then we must delegate to default Express error handler
  // to close connection and fail request
  if (res.headersSent) return next(err)

  // Log complete error details
  logger.error(err)

  // Send sanitized error response to client
  return res.status(500).send({ error: 'Internal server error' })
}

module.exports = { errorHandler }
