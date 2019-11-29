const { createAccount, createEmail, service } = require('./utils/resources')

describe('Acceptance - Accounts Routes', () => {
  test('When a valid payload is sent to /account/create, then an account is created', async () => {
    const name = 'Rad Tester'
    const email = createEmail()
    const password = 'hecka rad secret tester'

    const res = await service
      .post('/account/create')
      .send({ name, email, password })
      .expect(201)

    expect(res.body).toEqual({ data: { name, email } })
    expect(res.headers['set-cookie'][0]).toEqual(expect.stringContaining('session='))
  })

  test('When a single email is used to create multiple accounts, then service responds with user exists', async () => {
    const { email } = await createAccount()

    const res = await service
      .post('/account/create')
      .send({ name: 'Duplicate Email', email, password: 'duplicate email' })
      .expect(422)

    expect(res.body).toEqual({
      error: {
        code: 'ACCOUNT_EXISTS',
        message: 'Account for email already exists',
      },
    })
    expect(res.headers['set-cookie']).toBeFalsy()
  })

  test('When name is missing in account create, then service responds with error', async () => {
    const res = await service
      .post('/account/create')
      .send({ email: createEmail(), password: 'hecka rad secret tester' })
      .expect(400)

    expect(res.body).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Request is not valid',
        errors: [
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'name'",
            params: {
              missingProperty: 'name',
            },
            schemaPath: '#/required',
          },
        ],
      },
    })
  })

  test('When email is missing in account create, then service responds with error', async () => {
    const res = await service
      .post('/account/create')
      .send({ name: 'Rad Tester', password: 'hecka rad secret tester' })
      .expect(400)

    expect(res.body).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Request is not valid',
        errors: [
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'email'",
            params: {
              missingProperty: 'email',
            },
            schemaPath: '#/required',
          },
        ],
      },
    })
  })

  test('When email is invalid in account create, then service responds with error', async () => {
    const res = await service
      .post('/account/create')
      .send({ name: 'Rad Tester', email: 'uh-oh', password: 'hecka rad secret tester' })
      .expect(400)

    expect(res.body).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Request is not valid',
        errors: [
          {
            dataPath: '.email',
            keyword: 'format',
            message: 'should match format "email"', // eslint-disable-line
            params: {
              format: 'email',
            },
            schemaPath: '#/properties/email/format',
          },
        ],
      },
    })
  })

  test('When password is missing in account create, then service responds with error', async () => {
    const res = await service
      .post('/account/create')
      .send({ name: 'Rad Tester', email: createEmail() })
      .expect(400)

    expect(res.body).toEqual({
      error: {
        code: 'INVALID_REQUEST',
        message: 'Request is not valid',
        errors: [
          {
            dataPath: '',
            keyword: 'required',
            message: "should have required property 'password'",
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
