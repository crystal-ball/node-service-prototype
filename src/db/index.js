'use strict'

const { Pool } = require('pg')

const { getConfigs } = require('../configs')
const { logger } = require('../logger')

class DB {
  pool = undefined

  /**
   * Handle creating connections pool to database
   */
  initializeDb = async () => {
    const configs = getConfigs()

    this.pool = new Pool({
      host: configs.POSTGRES_HOST,
      port: configs.POSTGRES_PORT,
      user: configs.POSTGRES_USER,
      password: configs.POSTGRES_PASSWORD,
      database: configs.POSTGRES_DATABASE,
    })

    this.pool.on('error', (err) => {
      logger.fatal('Unexpected error on idle client', err)
      process.exitCode(1)
      throw err
    })

    try {
      // Ensure that database is ready for connections
      // TODO: add retries to this for just in case
      const client = await this.pool.connect()
      await client.query('SELECT NOW()')
      client.release()
    } catch (err) {
      logger.error('💥 Database connection failure', err)
    }

    logger.info('Pool successfully created and ready for connections')

    return {
      close: async () => {
        try {
          await this.pool.end()
          logger.info('Pool successfully closed')
        } catch (err) {
          logger.error('Failed to close pool', err)
        }
      },
    }
  }

  /**
   * Access the initialized configs
   */
  getPool = () => this.pool
}

const dbSingleton = new DB()

module.exports = {
  initializeDb: dbSingleton.initializeDb,
  getPool: dbSingleton.getPool,
}
