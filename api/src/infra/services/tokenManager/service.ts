import * as jose from 'jose'
import { type ApplicationError, errors } from '../../../core/entities/errors/entity'
import type { TokenManagerService } from '../../../core/services/tokenManager/service'
import type { Config } from '../../../infra/config/schema'

interface TokenManagerServiceDeps {
  config: Config
}

export const make = (deps: TokenManagerServiceDeps): TokenManagerService => {
  const { config } = deps

  const secret = new TextEncoder().encode(config.jwt.jwtSecret)
  const alg = config.jwt.alg
  const options = { expiresIn: '1h' }

  const createToken = async (email: string): Promise<string> => {
    const payload = { email }
    return new jose.SignJWT(payload).setProtectedHeader({ alg, exp: options.expiresIn }).sign(secret)
  }

  const verifyToken = async (token: string): Promise<boolean | ApplicationError> => {
    try {
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
    } catch (err) {
      return errors.Service('Invalid token', {
        type: 'Internal',
        serviceName: 'Token Manager Service',
        system: 'Local',
        reason: 'Invalid token',
        value: 'Email not found in token payload'
      })
    }
  }

  return { createToken, verifyToken }
}
