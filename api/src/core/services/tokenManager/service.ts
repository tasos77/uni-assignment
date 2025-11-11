import type { ApplicationError } from '../../entities/errors/entity'
import type { User } from '../../entities/user/entity'

export interface TokenManagerService {
  createToken: (user: User) => Promise<string>
  verifyToken: (token: string) => Promise<boolean | ApplicationError>
}
