import jwt from 'jsonwebtoken'
import util from 'util'

import { getConfigs } from '../configs.mjs'

const asyncSign = util.promisify(jwt.sign)
const asyncVerify = util.promisify(jwt.verify)

const configs = getConfigs()

/**
 * Will create a signed JWT using the passed contents
 */
export async function signJWT(contents) {
  await asyncSign(contents, configs.JWT_SECRET)
}

/**
 * Will verify a passed token and return decoded contents or throw an error.
 * Note: Util does not handle converting, catching errors! Errors ref:
 * https://github.com/auth0/node-jsonwebtoken#errors--codes
 */
export async function verifyJWT(token) {
  await asyncVerify(token, configs.JWT_SECRET)
}
