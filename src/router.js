'use strict'

const { getUsernames } = require('./routes/usernames')

/**
 * Handle mounting all routes to app
 */
const initializeRoutes = app => {
  app.get('/healthcheck', (req, res) => {
    res.send({ data: '🔮 MAGIC' })
  })

  // --- User routes ---
  app.get('/usernames', getUsernames)
}

module.exports = { initializeRoutes }
