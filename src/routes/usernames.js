'use strict'

const { selectUsernames } = require('../db')

const getUsernames = async (req, res) => {
  const usernames = await selectUsernames()
  req.log.info(`Fetched usernames: ${usernames}`)
  res.send({ data: usernames })
}

module.exports = { getUsernames }
