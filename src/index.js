'use strict'

const express = require('express')

const { setupLogger } = require('./utils/logger')

const app = express()

const initializeService = async () => {
  const logger = await setupLogger()

  app.get('/', (req, res) => {
    logger.log('REQ RECEIVED')
    res.send({ data: { message: '🔮 MAGIC' } })
  })

  app
    .listen(3000, () => {
      logger.log('Service listening on http://localhost:3000')
    })
    .on('error', err => {
      console.log(err)
      process.exit(1)
    })
}

// Start the party 🎉
initializeService()
