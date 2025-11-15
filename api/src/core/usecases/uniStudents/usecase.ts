import { hash } from '../../../infra/utils/hasher'
import { serializeFilters } from '../../../infra/utils/serializer'
import { type ApplicationError, errors, isApplicationError } from '../../entities/errors/entity'
import type { Gift } from '../../entities/gift/entity'
import type { SignInCreds, SignUpFormData, User } from '../../entities/user/entity'
import type { DBManagerService } from '../../services/dbManager/service'
import type { TokenManagerService } from '../../services/tokenManager/service'

interface UniStudentsUsecaseDeps {
  dbManagerService: DBManagerService
  tokenManagerService: TokenManagerService
}

export interface UniStudentsUsecase {
  authenticateUser: (creds: SignInCreds) => Promise<string | ApplicationError>
  createUser: (formData: SignUpFormData) => Promise<string | ApplicationError>
  matchUser: (email: string) => Promise<string | ApplicationError>
  updatePassword: (creds: SignInCreds, token: string) => Promise<boolean | ApplicationError>
  getGifts: (token: string, filters: { channels: string; types: string; brandTitles: string; category: string }, page: number) => Promise<Gift[] | ApplicationError>
  searchGifts: (token: string, input: string, page: number) => Promise<Gift[] | ApplicationError>
  getUser: (token: string, email: string) => Promise<User | ApplicationError>
  claimGift: (token: string, email: string, giftId: string) => Promise<boolean | ApplicationError>
}

export const make = (deps: UniStudentsUsecaseDeps): UniStudentsUsecase => {
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

  const createUser = async (formData: SignUpFormData): Promise<string | ApplicationError> => {
    try {
      const result = await dbManagerService.searchUser(formData.email)
      if (isApplicationError(result) && result.details.kind === 'EntityNotFound') {
        const hashedPassword = hash(formData.password)
        const userCreationResult = await dbManagerService.createUser({ email: formData.email, password: hashedPassword, fullName: formData.fullName })
        if (isApplicationError(userCreationResult)) {
          return userCreationResult
        }
        const token = await tokenManagerService.createToken(formData.email)
        return token
      }
      if (result) {
        return errors.Service('User already exists', {
          type: 'Internal',
          serviceName: 'AuthUsecase',
          system: 'Local',
          reason: 'User already exists',
          value: formData.email
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

  const updatePassword = async (creds: SignInCreds, token: string): Promise<boolean | ApplicationError> => {
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

  const getGifts = async (
    token: string,
    filters: { channels: string; types: string; brandTitles: string; category: string },
    page: number
  ): Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError> => {
    const tokenValidation = tokenManagerService.verifyToken(token)
    if (!isApplicationError(tokenValidation)) {
      const serializedFilters = serializeFilters(filters)
      return await dbManagerService.getGifts(serializedFilters, page)
    } else {
      return errors.Service('Invalid token', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Invalid token',
        value: 'Invalid token'
      })
    }
  }

  const searchGifts = async (token: string, input: string, page: number): Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError> => {
    const tokenValidation = tokenManagerService.verifyToken(token)
    if (!isApplicationError(tokenValidation)) {
      return await dbManagerService.searchGifts(input, page)
    } else {
      return errors.Service('Invalid token', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Invalid token',
        value: 'Invalid token'
      })
    }
  }

  const getUser = async (token: string, email: string): Promise<User | ApplicationError> => {
    const tokenValidation = tokenManagerService.verifyToken(token)
    if (!isApplicationError(tokenValidation)) {
      return await dbManagerService.getUser(email)
    } else {
      return errors.Service('Invalid token', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Invalid token',
        value: 'Invalid token'
      })
    }
  }

  const claimGift = async (token: string, email: string, giftId: string): Promise<boolean | ApplicationError> => {
    const tokenValidation = tokenManagerService.verifyToken(token)
    if (!isApplicationError(tokenValidation)) {
      return await dbManagerService.claimGift(email, giftId)
    } else {
      return errors.Service('Invalid token', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Invalid token',
        value: 'Invalid token'
      })
    }
  }

  return {
    authenticateUser,
    createUser,
    matchUser,
    updatePassword,
    getGifts,
    searchGifts,
    getUser,
    claimGift
  }
}
