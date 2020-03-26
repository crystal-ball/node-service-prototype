'use strict'

const bodyParser = require('body-parser')

const { asyncHandler } = require('./routes/async-handler')
const { createAccount, getAccount } = require('./routes/accounts')
const { loginAccount, logoutAccount } = require('./routes/authentication')
const { requestValidation } = require('./middleware/validation')
const { verifySession } = require('./middleware/verify-jwt')

const jsonParser = bodyParser.json()

/**
 * Handle mounting all routes to app
 */
const initializeRoutes = (app) => {
  app.get('/healthcheck', (req, res) => {
    res.send({ data: '🔮✨ MAGIC' })
  })

  // --- Authentication routes ---
  app.post(
    '/auth/login',
    jsonParser,
    requestValidation(loginAccount.schema),
    asyncHandler(loginAccount.handler),
  )
  app.get('/auth/logout', asyncHandler(logoutAccount.handler))

  // --- Account routes ---
  app.get('/account', verifySession, asyncHandler(getAccount.handler))
  app.post(
    '/account/create',
    jsonParser,
    requestValidation(createAccount.schema),
    asyncHandler(createAccount.handler),
  )

  // For any unhandled request return a 404
  app.use((req, res) => {
    res.status(404).send({ error: { code: 'NOT_FOUND', message: 'Route not found' } })
  })
}

module.exports = { initializeRoutes }
