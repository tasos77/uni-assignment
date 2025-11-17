import type { ApplicationError } from '../../entities/errors/entity'
import type { Filters, Gift } from '../../entities/gift/entity'
import type { SignInCreds, SignUpFormData, User } from '../../entities/user/entity'
import type { PostgreRepository } from '../../repositories/postgre/repository'

// db manager depedencies schema
export interface DBManagerServiceDeps {
  postgreRepo: PostgreRepository
}

// db manager schema
export interface DBManagerService {
  searchUniqueUser: (user: SignInCreds) => Promise<boolean | ApplicationError>
  searchUser: (email: string) => Promise<boolean | ApplicationError>
  createUser: (formData: SignUpFormData) => Promise<boolean | ApplicationError>
  getUser: (email: string) => Promise<User | ApplicationError>
  updateUser: (user: SignInCreds) => Promise<boolean | ApplicationError>
  claimGift: (email: string, giftId: string) => Promise<boolean | ApplicationError>
  getGifts: (filters: Filters, page: number, sort: string) => Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError>
  searchGifts: (input: string, page: number, sort: string) => Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError>
}

// db manager service implementation (propagate postgre repo functionality)
export const make = (deps: DBManagerServiceDeps): DBManagerService => {
  const { postgreRepo } = deps

  const searchUniqueUser = (creds: SignInCreds): Promise<boolean | ApplicationError> => {
    return postgreRepo.searchUserBasedOnCredentials(creds)
  }

  const searchUser = (email: string): Promise<boolean | ApplicationError> => {
    return postgreRepo.searchUserBasedOnEmail(email)
  }

  const createUser = (formData: SignUpFormData): Promise<boolean | ApplicationError> => {
    return postgreRepo.createUser(formData)
  }

  const getUser = (email: string): Promise<User | ApplicationError> => {
    return postgreRepo.getUser(email)
  }

  const updateUser = (creds: SignInCreds): Promise<boolean | ApplicationError> => {
    return postgreRepo.updateUser(creds)
  }

  const claimGift = (email: string, giftId: string): Promise<boolean | ApplicationError> => {
    return postgreRepo.claimGift(email, giftId)
  }

  const getGifts = (filters: Filters, page: number, sort: string): Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError> => {
    return postgreRepo.getGifts(filters, page, sort)
  }

  const searchGifts = (input: string, page: number, sort: string): Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError> => {
    return postgreRepo.searchGifts(input, page, sort)
  }

  return {
    createUser,
    getUser,
    updateUser,
    claimGift,
    searchUniqueUser,
    searchUser,
    getGifts,
    searchGifts
  }
}
