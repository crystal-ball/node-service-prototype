'use strict'

jest.mock('../utils/logger.js')

const { errorHandler } = require('./error-handler')
const { logger } = require('../utils/logger')

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
  test('When an error is handled, then only sanitized errors are responded', () => {
    const testError = new Error('Oh no')
    const mockLogger = jest.spyOn(logger, 'error')
    const req = () => {}
    const status = jest.fn()
    const send = jest.fn()
    const res = mockResponse(status, send, { headersSent: false })

    errorHandler(testError, req, res)

    expect(mockLogger).toHaveBeenCalledWith(testError)
    expect(status).toHaveBeenCalledWith(500)
    expect(send).toHaveBeenCalledWith({ error: 'Internal server error' })
  })
})
