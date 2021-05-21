import util from 'util'
import jwt from 'jsonwebtoken'

import { getConfigs } from '../configs.js'

const asyncSign = util.promisify(jwt.sign)
const asyncVerify = util.promisify(jwt.verify)

const configs = getConfigs()

/**
 * Will create a signed JWT using the passed contents
 */
export const signJWT = (contents) => asyncSign(contents, configs.JWT_SECRET)

/**
 * Will verify a passed token and return decoded contents or throw an error.
 * Note: Util does not handle converting, catching errors! Errors ref:
 * https://github.com/auth0/node-jsonwebtoken#errors--codes
 */
export const verifyJWT = (token) => asyncVerify(token, configs.JWT_SECRET)
