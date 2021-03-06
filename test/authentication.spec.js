import { createAccount, service } from './utils/resources'

describe('Acceptance - Authentication Routes', () => {
  it('When correct credentials are sent to /auth/login, then session cookie is returned', async () => {
    const { email, password } = await createAccount()

    const res = await service.post('/auth/login').send({ email, password }).expect(200)

    expect(res.headers['set-cookie'][0]).toStrictEqual(
      expect.stringContaining('session='),
    )
  })

  it('When email is missing, then service responds with a 400', async () => {
    const res = await service
      .post('/auth/login')
      .send({ password: 'hecka rad secret tester' })
      .expect(400)

    expect(res.body).toStrictEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Request is not valid',
        errors: [
          {
            instancePath: '',
            keyword: 'required',
            message: "must have required property 'email'",
            params: {
              missingProperty: 'email',
            },
            schemaPath: '#/required',
          },
        ],
      },
    })
  })

  it('When password is missing, then service responds with a 400', async () => {
    const res = await service
      .post('/auth/login')
      .send({ email: 'doesnt-matter-validation-failure@gmail.com' })
      .expect(400)

    expect(res.body).toStrictEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Request is not valid',
        errors: [
          {
            instancePath: '',
            keyword: 'required',
            message: "must have required property 'password'",
            params: {
              missingProperty: 'password',
            },
            schemaPath: '#/required',
          },
        ],
      },
    })
  })

  it('When incorrect password is submitted, then service returns a 401', async () => {
    const { email } = await createAccount()

    const res = await service
      .post('/auth/login')
      .send({ email, password: 'uh-oh' })
      .expect(401)

    expect(res.body).toStrictEqual({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authorization required',
      },
    })
  })

  it('When an email that isnt associated with an account is submitted, then service returns a 401', async () => {
    const res = await service
      .post('/auth/login')
      .send({ email: 'not.an.account@gmail.com', password: 'uh-oh' })
      .expect(401)

    expect(res.body).toStrictEqual({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authorization required',
      },
    })
  })

  it('When logout endpoint is hit, then session cookie is cleared', async () => {
    const res = await service.get('/auth/logout').expect(200)

    expect(res.headers['set-cookie']).toStrictEqual(
      expect.arrayContaining(['session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT']),
    )
    expect(res.body).toStrictEqual({
      data: {
        success: true,
      },
    })
  })
})
