'use strict'

const { Pool } = require('pg')

const { configs } = require('./configs')
const { logger } = require('./utils/logger')

let pool

/**
 * Handle creating connections pool to database
 */
const initializeDb = () => {
  pool = new Pool({
    user: configs.pgUser,
    password: configs.pgPassword,
    database: configs.pgDatabase,
  })

  logger.log('Pool successfully created')

  return {
    close: async () => {
      try {
        await pool.end()
        logger.log('Pool successfully closed')
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
    const result = await pool.query('SELECT * FROM account')
    console.log(result.rows)
    return result.rows
  } catch (err) {
    logger.error('Failed querying usernames', err)
    throw err
  }
}

module.exports = {
  initializeDb,
  selectUsernames,
}
