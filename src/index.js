'use strict'

const express = require('express')
const { Pool } = require('pg')

const { setupLogger } = require('./utils/logger')

const app = express()

const initializeService = async () => {
  const logger = await setupLogger()

  const pool = new Pool({
    user: 'rad_user',
    password: 'rad_password',
    database: 'service_db',
  })

  app.get('/', (req, res) => {
    logger.log('REQ RECEIVED')
    res.send({ data: { message: '🔮 MAGIC' } })
  })

  app.get('/usernames', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM account')
      console.log(result.rows)
      res.send({ data: result.rows })
    } catch (err) {
      logger.error(err)
      res.status(500).send()
    }
  })

  const server = app
    .listen(3000, () => {
      logger.log('Service listening on http://localhost:3000')
    })
    .on('error', err => {
      console.log(err)
      process.exit(1)
    })

  const gracefulShutdown = async () => {
    console.log('Shutting down ...')
    try {
      await Promise.all([pool.end(), server.close()])
      console.log('Server successfully shut down')
      process.exit(0)
    } catch (err) {
      console.error('Failed to shutdown gracefully', err)
      process.exit(1)
    }
  }

  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)
}

// Start the party 🎉
initializeService()
