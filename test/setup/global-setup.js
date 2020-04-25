/* eslint-disable no-console */

'use strict'

const migrate = require('node-pg-migrate').default
const { service } = require('../utils/resources')

// Default configs set to work for running acceptance tests from local against
// the Docker Compose containers
const host = process.env.POSTGRES_HOST || '127.0.0.1'
const port = process.env.POSTGRES_PORT || 5433
const user = process.env.POSTGRES_USER || 'test_user'
const password = process.env.POSTGRES_PASSWORD || 'test_password'
const database = process.env.POSTGRES_DATABASE || 'test_db'

const globalSetup = async () => {
  console.log('Running DB migrations ...')
  try {
    const databaseUrl = `postgres://${user}:${password}@${host}:${port}/${database}`

    await migrate({
      databaseUrl,
      dir: 'migrations',
      direction: 'up',
    })
    console.log('🎉 Migrations completed')

    // Ensure that service is started and ready for tests
    await service.get('/healthcheck')
    console.log('🎉 Service ready')
  } catch (err) {
    console.error(
      '💥 Unable to run acceptance test suite, ensure all resources are started with Docker Compose',
      err,
    )
    // Don't try to run the test suite if db or service isn't reachable
    throw err
  }
}

module.exports = globalSetup
