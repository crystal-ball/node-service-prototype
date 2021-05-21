// ⏱ OTel tracer libraries must be imported before other packages for
// auto-instrumentation setup
import './tracer.js'

import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import { initializeConfigs } from './configs.js'
import { initializeLogger } from './logger.js'
import { initializeDb } from './db/index.js'
import { initializeRoutes } from './router.js'
import { initalizeErrorHandlers } from './middleware/error-handlers.js'
import { reqLogger } from './middleware/req-logger.js'

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
