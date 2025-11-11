import { hash } from '../../../infra/utils/hasher'
import { type ApplicationError, errors, isApplicationError } from '../../entities/errors/entity'
import type { User } from '../../entities/user/entity'
import type { DBManagerService } from '../../services/dbManager/service'
import type { TokenManagerService } from '../../services/tokenManager/service'

interface AuthUsecaseDeps {
  dbManagerService: DBManagerService
  tokenManagerService: TokenManagerService
}

export interface AuthUsecase {
  authenticateUser: (user: User) => Promise<string | ApplicationError>
  createUser: (user: User) => Promise<string | ApplicationError>
}

export const make = (deps: AuthUsecaseDeps): AuthUsecase => {
  const { dbManagerService, tokenManagerService } = deps

  const authenticateUser = async (user: User): Promise<string | ApplicationError> => {
    try {
      const result = await dbManagerService.searchUniqueUser(user)
      if (isApplicationError(result)) {
        return result
      }
      return await tokenManagerService.createToken(user)
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

  const createUser = async (user: User): Promise<string | ApplicationError> => {
    try {
      const result = await dbManagerService.searchUniqueUser(user)
      if (isApplicationError(result)) {
        return result
      }
      if (result) {
        return errors.Service('User already exists', {
          type: 'Internal',
          serviceName: 'AuthUsecase',
          system: 'Local',
          reason: 'User already exists',
          value: user.email
        })
      }
      const hashedPassword = hash(user.password)
      const userCreationResult = await dbManagerService.createUser({ email: user.email, password: hashedPassword })
      if (isApplicationError(userCreationResult)) {
        return userCreationResult
      }
      const token = await tokenManagerService.createToken(user)
      return token
    } catch (error) {
      return errors.Service('User creation failed', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'User creation failed',
        value: (error as Error).message
      })
    }
  }
  // const matchUser = ...
  // const updatePassword = ...

  return {
    authenticateUser,
    createUser
  }
}
