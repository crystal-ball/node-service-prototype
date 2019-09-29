'use strict'

const argon2 = require('argon2')

/**
 * Generate a hashed password
 */
const generatePasswordHash = async password => argon2.hash(password)

/**
 * Validate a password matches the digest
 */
const validatePassword = async (password, hashedPassword) =>
  argon2.verify(hashedPassword, password)

module.exports = {
  generatePasswordHash,
  validatePassword,
}
