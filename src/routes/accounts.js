'use strict'

const { insertAccount, selectAccountById } = require('../db/accounts')
const { generatePasswordHash, signJWT } = require('../utils')
const { UniqueConstraintError } = require('../errors')

/**
 * POST - /account/create { email: String, name: String, password: String }
 *
 * - Valid email, name and password required
 * - Invalid requests will return a 400
 * - Valid request will create a user and JWT session token
 * - Session token is returned in a secure cookie
 */
const createAccount = {
  schema: {
    body: {
      $id: 'account-create-body',
      examples: [
        {
          name: 'Rad Tester',
          email: 'rad.tester@gmail.com',
          password: 'hecka secret password',
        },
      ],
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
          format: 'email',
        },
        password: {
          type: 'string',
        },
      },
      required: ['name', 'email', 'password'],
    },
  },
  handler: async (req, res) => {
    const { email, name, password } = req.body

    const hashedPassword = await generatePasswordHash(password)

    try {
      const { id } = await insertAccount({ email, name, hashedPassword }, req.log)

      // User created, create session 🎉
      const sessionToken = await signJWT({ accountId: id })

      res
        .status(201)
        // TODO: make cookie secure in production envs
        .cookie('session', sessionToken)
        .send({ data: { name, email } })
    } catch (err) {
      // TODO: why is this error being caught and sanitized instead of using a
      // custom error class like the login errors?
      if (err instanceof UniqueConstraintError) {
        // Unique constrain error on insert means that this email is already
        // associated with an account in the db, so we cannot create a new
        // account for it
        res.status(422).send({
          error: {
            code: 'ACCOUNT_EXISTS',
            message: 'Account for email already exists',
          },
        })
      } else {
        throw err
      }
    }
  },
}

/**
 * GET - /account
 */
const getAccount = {
  handler: async (req, res) => {
    const { id } = req.account
    req.log.info(`Looking up account ${id}`)

    const { name, email } = await selectAccountById(id, req.log)
    res.send({ data: { name, email } })
  },
}

module.exports = { createAccount, getAccount }
