import * as jose from 'jose'
import type { Config } from '../../../infra/config/schema'
import { type ApplicationError, errors } from '../../entities/errors/entity'
import type { User } from '../../entities/user/entity'

interface TokenManagerServiceDeps {
  config: Config
}

export interface TokenManagerService {
  createToken: (user: User) => Promise<string>
  verifyToken: (token: string) => Promise<boolean | ApplicationError>
}

export const make = (deps: TokenManagerServiceDeps): TokenManagerService => {
  const { config } = deps

  const secret = new TextEncoder().encode(config.jwt.jwtSecret)
  const alg = config.jwt.alg
  const options = { expiresIn: '1h' }

  const createToken = async (user: User): Promise<string> => {
    const payload = { email: user.email }
    return new jose.SignJWT(payload).setProtectedHeader({ alg, exp: options.expiresIn }).sign(secret)
  }

  const verifyToken = async (token: string): Promise<boolean | ApplicationError> => {
    const { payload } = await jose.jwtVerify(token, secret)
    if (payload.email) {
      return true
    }
    return errors.Service('Invalid token', {
      type: 'Internal',
      serviceName: 'Token Manager Service',
      system: 'Local',
      reason: 'Invalid token',
      value: 'Email not found in token payload'
    })
  }

  return { createToken, verifyToken }
}
