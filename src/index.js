'use strict'

const express = require('express')

const { initializeConfigs } = require('./configs')
const { initializeLogger } = require('./utils/logger')
const { initializeDb } = require('./db')
const { initializeRoutes } = require('./router')
const { errorHandler } = require('./middleware/error-handler')

/**
 * Service entry point will manage initializing service resources and then
 * start service instance
 */
const initializeService = async () => {
  console.log('Begin initializing service 🤖')

  const app = express()

  // --- Initialize service resources ---

  const configs = await initializeConfigs()
  const logger = await initializeLogger()
  const db = await initializeDb()

  // --- Initialize service middleware and routes ---

  await initializeRoutes(app)
  // Service error handler will ensure only sanitized error info is exposed
  app.use(errorHandler)

  // --- Create service instance ---

  const server = app
    .listen(configs.port, () => {
      logger.log('Service listening on http://localhost:3000')
    })
    .on('error', err => {
      console.log(err)
      process.exit(1)
    })

  // --- Setup service graceful shutdown ---

  const gracefulShutdown = async () => {
    try {
      console.log('Shutting down service...')

      await Promise.all([db.close(), server.close()])

      console.log('Server successfully shut down')
      process.exit(0)
    } catch (err) {
      console.error('Failed to shutdown gracefully', err)
      process.exit(1)
    }
  }

  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)

  // Nodemon shutdown signal, ref:
  // https://github.com/remy/nodemon#controlling-shutdown-of-your-script
  process.once('SIGUSR2', gracefulShutdown)
}

// Start the party 🎉
initializeService()
