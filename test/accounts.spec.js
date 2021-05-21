import { createAccount, createEmail, service } from './utils/resources'

describe('Acceptance - Accounts Routes', () => {
  it('When a valid payload is sent to /account/create, then an account is created', async () => {
    const name = 'Rad Tester'
    const email = createEmail()
    const password = 'hecka rad secret tester'

    const res = await service
      .post('/account/create')
      .send({ name, email, password })
      .expect(201)

    expect(res.body).toStrictEqual({ data: { name, email } })
    expect(res.headers['set-cookie'][0]).toStrictEqual(
      expect.stringContaining('session='),
    )
  })

  it('When a single email is used to create multiple accounts, then service responds with user exists', async () => {
    const { email } = await createAccount()

    const res = await service
      .post('/account/create')
      .send({ name: 'Duplicate Email', email, password: 'duplicate email' })
      .expect(422)

    expect(res.body).toStrictEqual({
      error: {
        code: 'ACCOUNT_EXISTS',
        message: 'Account for email already exists',
      },
    })
    expect(res.headers['set-cookie']).toBeFalsy()
  })

  it('When name is missing in account create, then service responds with error', async () => {
    const res = await service
      .post('/account/create')
      .send({ email: createEmail(), password: 'hecka rad secret tester' })
      .expect(400)

    expect(res.body).toStrictEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Request is not valid',
        errors: [
          {
            instancePath: '',
            keyword: 'required',
            message: "must have required property 'name'",
            params: {
              missingProperty: 'name',
            },
            schemaPath: '#/required',
          },
        ],
      },
    })
  })

  it('When email is missing in account create, then service responds with error', async () => {
    const res = await service
      .post('/account/create')
      .send({ name: 'Rad Tester', password: 'hecka rad secret tester' })
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

  it('When email is invalid in account create, then service responds with error', async () => {
    const res = await service
      .post('/account/create')
      .send({ name: 'Rad Tester', email: 'uh-oh', password: 'hecka rad secret tester' })
      .expect(400)

    expect(res.body).toStrictEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Request is not valid',
        errors: [
          {
            instancePath: '/email',
            keyword: 'format',
            message: 'must match format "email"',
            params: {
              format: 'email',
            },
            schemaPath: '#/properties/email/format',
          },
        ],
      },
    })
  })

  it('When password is missing in account create, then service responds with error', async () => {
    const res = await service
      .post('/account/create')
      .send({ name: 'Rad Tester', email: createEmail() })
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
})
