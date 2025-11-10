import { type ApplicationError, errors, isApplicationError } from '../../entities/errors/entity'
import type { User } from '../../entities/user/entity'
import type { DBManagerService } from '../../services/dbManager/service'
import type { TokenManagerService } from '../../services/tokenManager/service'

interface AuthUsecaseDeps {
  dbManager: DBManagerService
  tokenManager: TokenManagerService
}

export interface AuthUsecase {
  authenticateUser: (user: User) => Promise<string | ApplicationError>
}

export const make = (deps: AuthUsecaseDeps): AuthUsecase => {
  const { dbManager, tokenManager } = deps

  const authenticateUser = async (user: User): Promise<string | ApplicationError> => {
    try {
      const result = await dbManager.searchUser(user)
      if (isApplicationError(result)) {
        return result
      }
      return await tokenManager.createToken(user)
    } catch (error) {
      return errors.Service('Authentication failed', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Authentication failed',
        value: (error as Error).message
      })
    }
  }

  // const createUser  = ...
  // const matchUser = ...
  // const updatePassword = ...

  return {
    authenticateUser
  }
}
