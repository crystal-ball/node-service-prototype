'use strict'

jest.mock('../logger.js')
const { logger } = require('../logger')

const { initalizeErrorHandlers, unknownErrorHandler } = require('./error-handlers')

const mockResponse = (status, send, options) => {
  const res = { ...options }
  res.status = (...args) => {
    status(...args)
    return res
  }
  res.send = (...args) => {
    send(...args)
    return res
  }
  return res
}

describe('Error Handler', () => {
  test('When initialize hook is called, then error handlers are mounted', async () => {
    const app = {
      use: jest.fn(),
    }

    await initalizeErrorHandlers(app)

    expect(app.use).toHaveBeenCalled()
  })

  test('When an unknown error is handled, then only sanitized responses are sent', () => {
    const testError = new Error('Oh no')
    const mockLogger = jest.spyOn(logger, 'error')
    const req = () => {}
    const status = jest.fn()
    const send = jest.fn()
    const res = mockResponse(status, send, { headersSent: false })

    unknownErrorHandler(testError, req, res)

    expect(mockLogger).toHaveBeenCalledWith(testError)
    expect(status).toHaveBeenCalledWith(500)
    expect(send).toHaveBeenCalledWith({
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    })
  })
})
