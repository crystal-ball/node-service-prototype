'use strict'

/**
 * Calls async handlers and catches thrown errors in order to pass them to next
 * so they are handled by error middleware instead of crashing service
 */
const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next)

module.exports = { asyncHandler }
