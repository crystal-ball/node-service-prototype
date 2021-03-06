/**
 * Module is used for performing healthchecks on service within Docker
 * This solution doesn't require installing curl in our image, and lets
 * us log rad emojis if the healthcheck fails.
 */

import http from 'http'

const options = {
  host: process.env.SERVICE_HOST || '127.0.0.1',
  port: process.env.SERVICE_PORT || 9000,
  path: '/healthcheck',
  timeout: 1000,
}

const request = http.request(options, ({ statusCode }) => {
  console.info(`STATUS: ${statusCode}`)
  process.exitCode = statusCode === 200 ? 0 : 1
  process.exit()
})

request.on('error', (err) => {
  console.error('💥 ERROR', err)
  process.exit(1)
})

request.end()
