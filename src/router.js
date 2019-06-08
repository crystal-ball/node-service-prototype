'use strict'

const { asyncHandler } = require('./routes/async-handler')
const { getUsernames } = require('./routes/usernames')

/**
 * Handle mounting all routes to app
 */
const initializeRoutes = app => {
  app.get('/healthcheck', (req, res) => {
    res.send({ data: '🔮 MAGIC' })
  })

  // --- User routes ---
  app.get('/usernames', asyncHandler(getUsernames))

  // For any unhandled request return a 404
  app.use((req, res) => {
    res.status(404).send({ error: 'Route not found' })
  })
}

module.exports = { initializeRoutes }
