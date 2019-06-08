'use strict'

const { Pool } = require('pg')

const { configs } = require('../configs')
const { logger } = require('../utils/logger')

let pool

/**
 * Handle creating connections pool to database
 */
const initializeDb = async () => {
  pool = new Pool({
    user: configs.pgUser,
    password: configs.pgPassword,
    database: configs.pgDatabase,
  })

  pool.on('error', err => {
    logger.fatal('Unexpected error on idle client', err)
    process.exit(1)
  })

  logger.info('Pool successfully created')

  return {
    close: async () => {
      try {
        await pool.end()
        logger.info('Pool successfully closed')
      } catch (err) {
        logger.error('Failed to close pool', err)
      }
    },
  }
}

/**
 * Querys for all usernames
 */
const selectUsernames = async () => {
  try {
    const result = await pool.query('SELECT * FROM users')
    logger.info('Usernames', result.rows)
    return result.rows.map(row => row.name)
  } catch (err) {
    logger.error('Failed querying usernames', err)
    throw err
  }
}

module.exports = {
  initializeDb,
  selectUsernames,
}
