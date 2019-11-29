/**
 * Middleware that can be used to enforce a valid request body, header or query
 * param schema.
 * @module
 */

import Ajv from 'ajv'

// NB: AJV uses JSON Schema draft-07
// NB: validation errors are stored on the ajv instance until next validate call
// https://json-schema.org/understanding-json-schema
const ajv = new Ajv({ removeAdditional: true })

/**
 * Uses validation schemas for a req body, headers and query params to perform
 * validations and reject inproper requests. Validation schemas should be
 * defined as a JSON schema.
 *
 * ?? Would it be helpful to add some logging about the body here? It has the
 * danger of accidentally logging user info if it's forgetten about...
 */
export function requestValidation({ body, headers, queryParams }) {
  return (req, res, next) => {
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
}
