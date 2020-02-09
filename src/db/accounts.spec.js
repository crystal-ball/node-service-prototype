jest.mock('./index')
import db from './index'

import { UniqueConstraintError } from '../errors'
import { insertAccount } from './accounts'

describe('Accounts DB interface', () => {
  test('When insertAccount is called with account details, then new user account is inserted', async () => {
    const accountData = { email: 'test', name: 'test', hashedPassword: 'test' }
    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
    }

    db.getPool.mockImplementation(() => ({
      query: () => ({
        rows: [accountData, { extra: true }],
      }),
    }))

    const result = await insertAccount(accountData, mockLogger)

    expect(result).toEqual(accountData)
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  test('When insertAccount is called with existing email, then a UniqueConstrainError is thrown', async () => {
    // ℹ️ Mock pg throwing a unique constrain error which should be caught and
    // tranformed to a friendly service custom error

    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
    }
    db.getPool.mockImplementation(() => ({
      query: () => {
        const err = new Error('Unique Constraint')
        err.code = '23505'
        err.constraint = 'accounts_email_key'
        throw err
      },
    }))

    await expect(
      insertAccount({ email: 'test', name: 'test', hashedPassword: 'test' }, mockLogger),
    ).rejects.toThrow(UniqueConstraintError)

    // This should not log an error even though insert will throw
    expect(mockLogger.info).toHaveBeenCalled()
    expect(mockLogger.error).not.toHaveBeenCalled()
  })
})
