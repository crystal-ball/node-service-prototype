'use strict'

const { logger } = require('../utils/logger')
const { selectUsernames } = require('../db')

const getUsernames = async (req, res) => {
  try {
    const usernames = await selectUsernames()
    res.send({ data: usernames })
  } catch (err) {
    logger.error('Failed getting usernames', err)
    throw err
  }
}

module.exports = { getUsernames }
