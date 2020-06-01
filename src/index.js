'use strict'

const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const { initializeConfigs } = require('./configs')
const { initializeLogger } = require('./logger')
const { initializeDb } = require('./db')
const { initializeRoutes } = require('./router')
const { initalizeErrorHandlers } = require('./middleware/error-handlers')
const { reqLogger } = require('./middleware/req-logger')

/**
 * Service entry point will manage initializing service resources and then
 * start service instance
 */
const initializeService = async () => {
  console.log('Begin initializing service 🚀') // eslint-disable-line no-console

  const app = express()

  // --- Initialize service resources ---

  const configs = await initializeConfigs()
  const loggers = await initializeLogger()
  const db = await initializeDb()

  // --- Initialize service middleware and routes ---

  app.use(helmet())
  app.use(cookieParser())
  app.use(reqLogger)

  await initializeRoutes(app)
  await initalizeErrorHandlers(app)

  // --- Create service instance ---

  const { SERVICE_HOST, SERVICE_PORT } = configs
  const server = app
    .listen(SERVICE_PORT, SERVICE_HOST, () => {
      loggers.logger.info(`Service listening on http://localhost:${SERVICE_PORT}`)
    })
    .on('error', (err) => {
      console.log(err) // eslint-disable-line no-console
      process.exitCode(1)
      throw err
    })

  // --- Setup service graceful shutdown ---

  const gracefulShutdown = async () => {
    try {
      loggers.logger.info('Shutting down service...')

      await server.close()
      await db.close()

      loggers.logger.info('Server successfully shut down')
    } catch (err) {
      console.error('Failed to shutdown gracefully', err) // eslint-disable-line no-console
      process.exitCode(1)
      throw err
    }
  }

  // Handle graceful exit codes from Docker with shutdown
  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)

  // Nodemon shutdown signal, ref:
  // https://github.com/remy/nodemon#controlling-shutdown-of-your-script
  process.once('SIGUSR2', gracefulShutdown)
}

// Start the party 🎉
initializeService()
