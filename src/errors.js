/* eslint-disable camelcase */

/**
 * Defines reuseable custom error classes for throwing descriptive/helpful
 * errors.
 * @module
 */

// --- PG Error Constants ---
// Ref: https://www.postgresql.org/docs/current/errcodes-appendix.html
// ??? https://www.npmjs.com/package/pg-error-constants

export const pgErrorsMap = {
  unique_violation: '23505',
}

// --- Custom error codes ---

export const customErrorCodes = {
  unauthorized: 'unauthorized',
  forbidden: 'forbidden',
  uniqueConstraint: 'unique_constraint',
}

// --- Custom error classes ---

// TODO: ideal error class would allow passing an exception up through the
// service, adding in details to the error message along the way, and then
// logging it a single time with the original stack trace and the complete error
// message chain.

const customErrorConstructor = (error, { code, name, details }) => {
  /* eslint-disable no-param-reassign */
  error.code = code
  error.name = name

  details.forEach(detail => {
    error[detail] = details[detail]
  })
  /* eslint-enable no-param-reassign */
}

export class ForbiddenError extends Error {
  constructor(message, ...details) {
    super(message || 'Insufficient user permissions')
    customErrorConstructor(this, {
      code: customErrorCodes.forbidden,
      name: 'ForbiddenError',
      details,
    })
  }
}

export class UnauthorizedError extends Error {
  constructor(message, ...details) {
    super(message || 'User not authorized')
    customErrorConstructor(this, {
      code: customErrorCodes.unauthorized,
      name: 'UnauthorizedError',
      details,
    })
  }
}

export class UniqueConstraintError extends Error {
  constructor(message, ...details) {
    super(message || 'Query failed due to unique constraint')
    customErrorConstructor(this, {
      code: customErrorCodes.uniqueConstraint,
      name: 'UniqueConstraintError',
      details,
    })
  }
}
