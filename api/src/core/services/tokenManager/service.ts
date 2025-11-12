import type { ApplicationError } from '../../entities/errors/entity'
import type { SignInCreds } from '../../entities/user/entity'

export interface TokenManagerService {
  createToken: (creds: SignInCreds) => Promise<string>
  verifyToken: (token: string) => Promise<boolean | ApplicationError>
}
