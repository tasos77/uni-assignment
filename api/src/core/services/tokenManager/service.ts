import type { ApplicationError } from '../../entities/errors/entity'

export interface TokenManagerService {
  createToken: (email: string) => Promise<string>
  verifyToken: (token: string) => Promise<boolean | ApplicationError>
}
