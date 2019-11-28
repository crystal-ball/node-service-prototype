/**
 * Authentication routes manage the user's authentication session including
 * logging in and out. (See accounts routes for account CRUD management)
 * @module
 */

import { signJWT, validatePassword } from '../utils/index.js'
import { selectAccountByEmail } from '../db/accounts.js'
import { UnauthorizedError } from '../errors.js'

/**
 * POST - /auth/login { email: String, password: String }
 *
 * - Valid email and password required
 * - Invalid requests will return a 400
 * - Valid request will lookup account hashed password and compare a hash of
 *   submitted password for login
 * - Successful logins will create a JWT session cookie
 * - Failed logins of missing email or wrong password will return a 401
 */
export const loginAccount = {
  schema: {
    body: {
      $id: 'account-login-body',
      examples: [{ email: 'rad.tester@gmail.com', password: 'hecka secret password' }],
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        password: {
          type: 'string',
        },
      },
      required: ['email', 'password'],
    },
  },
  handler: async (req, res) => {
    const { email, password } = req.body

    // 1. Validate that account exists for email
    const account = await selectAccountByEmail(email, req.log)
    if (!account) throw new UnauthorizedError()

    // 2. Validate that password is correct for account
    const matching = await validatePassword(password, account.password)
    if (!matching) throw new UnauthorizedError()

    // 3. Correct email and password, create a session 🎉
    const sessionToken = await signJWT({ accountId: account.id })

    res
      .status(200)
      // TODO: make cookie secure in production envs
      .cookie('session', sessionToken)
      .send({ data: { success: true } })
  },
}

export const logoutAccount = {
  handler: async (req, res) => {
    res
      .status(200)
      .clearCookie('session')
      .send({ data: { success: true } })
  },
}
