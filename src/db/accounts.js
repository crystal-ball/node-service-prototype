/* eslint-disable camelcase */

'use strict'

const { getPool } = require('./index')
const { UniqueConstraintError, pgErrorsMap } = require('../errors')

const insertAccount = async ({ email, name, hashedPassword }, logger) => {
  const pool = getPool()
  const normalizedEmail = email.toLocaleLowerCase()

  try {
    const result = await pool.query(
      'INSERT INTO accounts (email, name, password) VALUES ($1, $2, $3) RETURNING id',
      [normalizedEmail, name, hashedPassword],
    )
    return result.rows[0]
  } catch (err) {
    if (
      err.code === pgErrorsMap.unique_violation &&
      err.constraint === 'accounts_email_key'
    ) {
      logger.info('Account already exists', { email })
      throw new UniqueConstraintError('Account already exists', { email })
    }

    logger.error('Failed inserting new account', { email }, err)
    throw err
  }
}

/**
 * Lookup an account by id
 */
const selectAccountById = async (id, logger) => {
  const pool = getPool()

  try {
    const result = await pool.query('SELECT * FROM accounts WHERE id = $1', [id])
    return result.rows[0]
  } catch (err) {
    logger.error('Failed to lookup account by id', { id }, err)
    throw err
  }
}

/**
 * Lookup an account by email
 */
const selectAccountByEmail = async (email, logger) => {
  const pool = getPool()

  try {
    const result = await pool.query('SELECT * FROM accounts WHERE email = $1', [email])
    return result.rows[0]
  } catch (err) {
    logger.error('Failed to lookup account by id', { email }, err)
    throw err
  }
}

module.exports = { insertAccount, selectAccountByEmail, selectAccountById }