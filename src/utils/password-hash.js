import argon2 from 'argon2'

/**
 * Generate a hashed password
 */
export const generatePasswordHash = async (password) => argon2.hash(password)

/**
 * Validate a password matches the digest
 */
export const validatePassword = async (password, hashedPassword) =>
  argon2.verify(hashedPassword, password)
