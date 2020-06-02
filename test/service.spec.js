'use strict'

const { service } = require('./utils/resources')

describe('Acceptance - Service', () => {
  test('When healthcheck is hit, service sends back a rad response', async () => {
    const res = await service.get('/healthcheck').expect(200)

    expect(res.body).toEqual({ data: '🔮✨ MAGIC' })
  })

  test('When an unknown route is hit, then a 404 is returned', async () => {
    const res = await service.get('/uh-oh').expect(404)

    expect(res.body).toEqual({
      error: { code: 'NOT_FOUND', message: 'Route not found' },
    })
  })

  test.skip('When malformed JSON is sent, then an invalid body 400 is returned', async () => {
    // Note: this must be posted to an endpoint that does body parsing to test
    const res = await service
      .post('/auth/login')
      .send('{ "uh-oh" }')
      .set('Content-Type', 'application/json')
      .expect(400)

    expect(res.body).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Unexpected token } in JSON at position 10',
      },
    })
  })
})
