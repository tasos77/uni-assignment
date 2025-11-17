import type { ApplicationError } from '../../entities/errors/entity'

// token manager service schema
export interface TokenManagerService {
  createToken: (email: string) => Promise<string>
  verifyToken: (token: string) => Promise<boolean | ApplicationError>
}
