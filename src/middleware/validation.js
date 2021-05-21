/**
 * Middleware that can be used to enforce a valid request body, header or query
 * param schema.
 * @module
 */

import Ajv from 'ajv'
import addFormats from 'ajv-formats'

// NB: AJV uses JSON Schema draft-07
// NB: validation errors are stored on the ajv instance until next validate call
// https://json-schema.org/understanding-json-schema
const ajv = new Ajv({ removeAdditional: true })
// Add JSON formats for email, dates, etc.
addFormats(ajv)

/**
 * Uses validation schemas for a req body, headers and query params to perform
 * validations and reject inproper requests. Validation schemas should be
 * defined as a JSON schema.
 *
 * ?? Would it be helpful to add some logging about the body here? It has the
 * danger of accidentally logging user info if it's forgetten about...
 */
export const requestValidation =
  ({ body, headers, queryParams }) =>
  (req, res, next) => {
    const errors = []

    if (body) {
      const validate = ajv.compile(body)
      const valid = validate(req.body)
      if (!valid) errors.push(...validate.errors)
    }

    if (headers) {
      const validate = ajv.compile(headers)
      const valid = validate(req.headers)
      if (!valid) errors.push(...validate.errors)
    }

    if (queryParams) {
      const validate = ajv.compile(queryParams)
      const valid = validate(req.query)
      if (!valid) errors.push(...validate.errors)
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
