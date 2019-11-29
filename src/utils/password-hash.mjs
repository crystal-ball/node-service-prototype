import argon2 from 'argon2'

/**
 * Generate a hashed password
 */
export async function generatePasswordHash(password) {
  return argon2.hash(password)
}

/**
 * Validate a password matches the digest
 */
export async function validatePassword(password, hashedPassword) {
  return argon2.verify(hashedPassword, password)
}
