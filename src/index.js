'use strict'

const express = require('express')
const helmet = require('helmet')

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
  const loggers = await initializeLogger()
  const db = await initializeDb()

  // --- Initialize service middleware and routes ---

  app.use(helmet())
  app.use(loggers.expressLogger)

  await initializeRoutes(app)
  // Service error handler will ensure only sanitized error info is exposed
  app.use(errorHandler)

  // --- Create service instance ---

  const server = app
    .listen(configs.port, () => {
      loggers.logger.info('Service listening on http://localhost:3000')
    })
    .on('error', err => {
      console.log(err)
      process.exit(1)
    })

  // --- Setup service graceful shutdown ---

  const gracefulShutdown = async () => {
    try {
      loggers.logger.info('Shutting down service...')

      await Promise.all([db.close(), server.close()])

      loggers.logger.info('Server successfully shut down')
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
