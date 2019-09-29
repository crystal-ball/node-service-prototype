'use strict'

/**
 * Middleware that can be used to enforce a valid request body, header or query
 * param schema.
 * @module
 */

const Ajv = require('ajv')

// NB: AJV uses JSON Schema draft-07
// NB: validation errors are stored on the ajv instance until next validate call
// https://json-schema.org/understanding-json-schema
const ajv = new Ajv({ removeAdditional: true })

/**
 * Uses validation schemas for a req body, headers and query params to perform
 * validations and reject inproper requests. Validation schemas should be
 * defined as a JSON schema.
 */
const requestValidation = ({ body, headers, queryParams }) => (req, res, next) => {
  const errors = []

  if (body) {
    const valid = ajv.validate(body, req.body)
    if (!valid) errors.push(...ajv.errors)
  }

  if (headers) {
    const valid = ajv.validate(headers, req.headers)
    if (!valid) errors.push(...ajv.errors)
  }

  if (queryParams) {
    const valid = ajv.validate(queryParams, req.query)
    if (!valid) errors.push(...ajv.errors)
  }

  if (!errors.length) return next() // Good news, this request is valid 🎉

  return res.status(400).send({
    error: {
      code: 'INVALID_REQUEST',
      message: 'Request is not valid',
      errors,
    },
  })
}

module.exports = { requestValidation }
