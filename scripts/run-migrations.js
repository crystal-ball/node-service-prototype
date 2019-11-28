/* eslint-disable no-console */

/**
 * Handle running migrations for the environment using env vars set by Docker
 * Compose, eg:
 *
 * 1. docker-compose up
 * 2. docker-compose exec service /bin/sh
 * 3. npm run migrate:up
 */

import migrate from 'node-pg-migrate'

const host = process.env.POSTGRES_HOST
const database = process.env.POSTGRES_DB
const password = process.env.POSTGRES_PASSWORD
const port = process.env.POSTGRES_PORT
const user = process.env.POSTGRES_USER

const performMigrations = async () => {
  console.log('Running DB migrations ...')
  try {
    await migrate({
      checkOrder: true,
      databaseUrl: `postgres://${user}:${password}@${host}:${port}/${database}`,
      dir: 'migrations',
      direction: 'up',
    })
    console.log('🎉 Migrations completed')
    process.exit(0)
  } catch (err) {
    console.error('💥 Migrations failed', err)
    process.exit(1)
  }
}

performMigrations()
