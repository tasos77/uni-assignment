import { hash } from '../../../infra/utils/hasher'
import { serializeFilters } from '../../../infra/utils/serializer'
import { type ApplicationError, errors, isApplicationError } from '../../entities/errors/entity'
import type { Gift } from '../../entities/gift/entity'
import type { SignInCreds, SignUpFormData, User } from '../../entities/user/entity'
import type { DBManagerService } from '../../services/dbManager/service'
import type { TokenManagerService } from '../../services/tokenManager/service'

// unistudents unsecase depedencies schema
interface UniStudentsUsecaseDeps {
  dbManagerService: DBManagerService
  tokenManagerService: TokenManagerService
}

// unistudents unsecase schema
export interface UniStudentsUsecase {
  authenticateUser: (creds: SignInCreds) => Promise<string | ApplicationError>
  createUser: (formData: SignUpFormData) => Promise<string | ApplicationError>
  matchUser: (email: string) => Promise<string | ApplicationError>
  updatePassword: (creds: SignInCreds, token: string) => Promise<boolean | ApplicationError>
  getUser: (token: string, email: string) => Promise<User | ApplicationError>
  claimGift: (token: string, email: string, giftId: string) => Promise<boolean | ApplicationError>
  getGifts: (
    token: string,
    filters: { channels: string; types: string; brandTitles: string; category: string },
    page: number,
    sort: string
  ) => Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError>
  searchGifts: (token: string, input: string, page: number, sort: string) => Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError>
}

// unistudents unsecase implementation
export const make = (deps: UniStudentsUsecaseDeps): UniStudentsUsecase => {
  const { dbManagerService, tokenManagerService } = deps
  const oneTimeTokens: Map<string, string> = new Map()

  // authenticate user
  const authenticateUser = async (creds: SignInCreds): Promise<string | ApplicationError> => {
    try {
      // authenticate user by email and password
      const result = await dbManagerService.searchUniqueUser({ email: creds.email, password: hash(creds.password) })
      if (isApplicationError(result)) {
        return result
      }
      // on successful authentication, create a token
      return await tokenManagerService.createToken(creds.email)
    } catch (error) {
      // on error, return error
      return errors.Service('Authentication failed', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Authentication failed',
        value: (error as Error).message
      })
    }
  }

  // create a new user
  const createUser = async (formData: SignUpFormData): Promise<string | ApplicationError> => {
    try {
      // search for existing user
      const result = await dbManagerService.searchUser(formData.email)
      if (isApplicationError(result) && result.details.kind === 'EntityNotFound') {
        // if no user found, create a new one
        const hashedPassword = hash(formData.password)
        const userCreationResult = await dbManagerService.createUser({ email: formData.email, password: hashedPassword, fullName: formData.fullName })
        if (isApplicationError(userCreationResult)) {
          return userCreationResult
        }
        // on successful user creation, create a token
        const token = await tokenManagerService.createToken(formData.email)
        return token
      }
      // if user found, return error
      if (result) {
        return errors.Service('User already exists', {
          type: 'Internal',
          serviceName: 'AuthUsecase',
          system: 'Local',
          reason: 'User already exists',
          value: formData.email
        })
      }
      // if user creation failed, return error
      return errors.Service('Unexpected search result', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'User creation failed',
        value: 'Failed to create user'
      })
    } catch (error) {
      // if user creation malfunctioned, return error
      return errors.Service('User creation failed', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'User creation failed',
        value: (error as Error).message
      })
    }
  }
  // match user
  const matchUser = async (email: string): Promise<string | ApplicationError> => {
    // search db for user
    const result = await dbManagerService.searchUser(email)
    if (isApplicationError(result)) {
      return result
    }
    // if user found create one time token
    const token = await tokenManagerService.createToken(email)
    // add one time token in hashMap
    oneTimeTokens.set(email, token)
    return token
  }

  // update password
  const updatePassword = async (creds: SignInCreds, token: string): Promise<boolean | ApplicationError> => {
    // if token is valid and is stored in hashMap
    if (token && oneTimeTokens.has(creds.email)) {
      // delete token from hashMap
      oneTimeTokens.delete(creds.email)
      // hash new password
      const hashedPassword = hash(creds.password)
      // update user password
      return await dbManagerService.updateUser({ email: creds.email, password: hashedPassword })
    } else {
      // on error, return error
      return errors.Service('Invalid or missing token', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Invalid or missing token',
        value: 'Invalid or missing token'
      })
    }
  }

  // get gifts
  const getGifts = async (
    token: string,
    filters: { channels: string; types: string; brandTitles: string; category: string },
    page: number,
    sort: string
  ): Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError> => {
    // validate token
    const tokenValidation = tokenManagerService.verifyToken(token)
    if (!isApplicationError(tokenValidation)) {
      // on success serialize filters
      const serializedFilters = serializeFilters(filters)
      // search for gifts
      return await dbManagerService.getGifts(serializedFilters, page, sort)
    } else {
      // handle token validation error
      return errors.Service('Invalid token', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Invalid token',
        value: 'Invalid token'
      })
    }
  }

  // search for gifts by title
  const searchGifts = async (token: string, input: string, page: number, sort: string): Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError> => {
    // validate token
    const tokenValidation = tokenManagerService.verifyToken(token)
    if (!isApplicationError(tokenValidation)) {
      // on success search for gifts
      return await dbManagerService.searchGifts(input, page, sort)
    } else {
      // handle token validation error
      return errors.Service('Invalid token', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Invalid token',
        value: 'Invalid token'
      })
    }
  }

  // get user by email
  const getUser = async (token: string, email: string): Promise<User | ApplicationError> => {
    // validate token
    const tokenValidation = tokenManagerService.verifyToken(token)
    if (!isApplicationError(tokenValidation)) {
      // get user by email
      return await dbManagerService.getUser(email)
    } else {
      // handle token validation error
      return errors.Service('Invalid token', {
        type: 'Internal',
        serviceName: 'AuthUsecase',
        system: 'Local',
        reason: 'Invalid token',
        value: 'Invalid token'
      })
    }
  }

  // claim gift by user
  const claimGift = async (token: string, email: string, giftId: string): Promise<boolean | ApplicationError> => {
    // validate token
    const tokenValidation = tokenManagerService.verifyToken(token)
    if (!isApplicationError(tokenValidation)) {
      // claim gift
      return await dbManagerService.claimGift(email, giftId)
    } else {
      // handle token validation error
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
