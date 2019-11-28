import supertest from 'supertest'

// Default configs set to work for running acceptance tests from local against
// the Docker Compose containers
const serviceHost = process.env.SERVICE_HOST || 'http://127.0.0.1'
const port = process.env.SERVICE_PORT || 9001

/**
 * Test service
 */
export const service = supertest(`${serviceHost}:${port}`)

/**
 * Create a uniqueish email to allow multiple test runs not to create unique
 * email constraint errors
 */
export function createEmail() {
  return `${Math.floor(Math.random() * 100000)}.tester@gmail.com`
}

/**
 * Create a test user
 */
export async function createAccount({
  name = 'Rad Tester',
  email = createEmail(),
  password = 'hecka rad secret tester',
} = {}) {
  const res = await service
    .post('/account/create')
    .send({ name, email, password })
    .expect(201)

  const sessionCookie = res.headers['set-cookie'][0]

  return { name, email, password, sessionCookie }
}
