'use strict'

const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send({ data: { message: '🔮 MAGIC' } })
})

app
  .listen(3000, () => {
    console.log('Service listening on http://localhost:3000')
  })
  .on('error', err => {
    console.log(err)
    process.exit(1)
  })
