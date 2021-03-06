import bodyParser from 'body-parser'

import { asyncHandler } from './routes/async-handler.js'
import { createAccount, getAccount } from './routes/accounts.js'
import { loginAccount, logoutAccount } from './routes/authentication.js'
import { requestValidation } from './middleware/validation.js'
import { verifySession } from './middleware/verify-jwt.js'

const jsonParser = bodyParser.json()

/**
 * Handle mounting all routes to app
 */
export function initializeRoutes(app) {
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
