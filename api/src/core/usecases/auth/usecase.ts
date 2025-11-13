import { hash } from '../../../infra/utils/hasher'
import { type ApplicationError, errors, isApplicationError } from '../../entities/errors/entity'
import type { SignInCreds, User } from '../../entities/user/entity'
import type { DBManagerService } from '../../services/dbManager/service'
import type { TokenManagerService } from '../../services/tokenManager/service'

interface AuthUsecaseDeps {
  dbManagerService: DBManagerService
  tokenManagerService: TokenManagerService
}

export interface AuthUsecase {
  authenticateUser: (creds: SignInCreds) => Promise<string | ApplicationError>
  createUser: (user: User) => Promise<string | ApplicationError>
  matchUser: (email: string) => Promise<string | ApplicationError>
  updatePassword: (creds: SignInCreds, token: string | undefined) => Promise<boolean | ApplicationError>
}

export const make = (deps: AuthUsecaseDeps): AuthUsecase => {
  const { dbManagerService, tokenManagerService } = deps
  const oneTimeTokens: Map<string, string> = new Map()

  const authenticateUser = async (creds: SignInCreds): Promise<string | ApplicationError> => {
    try {
      const result = await dbManagerService.searchUniqueUser({ email: creds.email, password: hash(creds.password) })
      if (isApplicationError(result)) {
        return result
      }
      return await tokenManagerService.createToken(creds.email)
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
      const result = await dbManagerService.searchUser(user.email)
      if (isApplicationError(result) && result.details.kind === 'EntityNotFound') {
        const hashedPassword = hash(user.password)
        const userCreationResult = await dbManagerService.createUser({ email: user.email, password: hashedPassword, fullName: user.fullName })
        if (isApplicationError(userCreationResult)) {
          return userCreationResult
        }
        const token = await tokenManagerService.createToken(user.email)
        return token
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

      return errors.Service('Unexpected search result', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'User creation failed',
        value: 'Failed to create user'
      })
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

  const matchUser = async (email: string): Promise<string | ApplicationError> => {
    const result = await dbManagerService.searchUser(email)
    if (isApplicationError(result)) {
      return result
    }
    const token = await tokenManagerService.createToken(email)
    oneTimeTokens.set(email, token)
    return token
  }

  const updatePassword = async (creds: SignInCreds, token: string | undefined): Promise<boolean | ApplicationError> => {
    if (token && oneTimeTokens.has(creds.email)) {
      oneTimeTokens.delete(creds.email)
      const hashedPassword = hash(creds.password)
      return await dbManagerService.updateUser({ email: creds.email, password: hashedPassword })
    } else {
      return errors.Service('Invalid or missing token', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Invalid or missing token',
        value: 'Invalid or missing token'
      })
    }
  }

  return {
    authenticateUser,
    createUser,
    matchUser,
    updatePassword
  }
}
