import { verifyJWT } from '../utils/index.js'
import { ForbiddenError, UnauthorizedError } from '../errors.js'

/**
 * Middleware should pick the jwt cookie from a req and verify it
 * IF valid -> set decoded account_id on request
 * ELSE -> Throw a verification error to return a 403
 */

export async function verifySession(req, res, next) {
  const { session } = req.cookies
  if (!session) return next(new UnauthorizedError())

  try {
    const token = await verifyJWT(session)
    req.account = { id: token.accountId }
    return next()
  } catch (err) {
    return next(new ForbiddenError('Invalid session token'))
  }
}
