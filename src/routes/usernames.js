'use strict'

const { selectUsernames } = require('../db')

const getUsernames = async (req, res) => {
  const usernames = await selectUsernames()
  res.send({ data: usernames })
}

module.exports = { getUsernames }
