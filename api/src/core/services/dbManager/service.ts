import type { ApplicationError } from '../../entities/errors/entity'
import type { SignInCreds, User } from '../../entities/user/entity'
import type { PostgreRepository } from '../../repositories/postgre/repository'

export interface DBManagerServiceDeps {
  postgreRepo: PostgreRepository
}

export interface DBManagerService {
  searchUniqueUser: (user: SignInCreds) => Promise<boolean | ApplicationError>
  searchUser: (email: string) => Promise<boolean | ApplicationError>
  createUser: (user: User) => Promise<boolean | ApplicationError>
}

export const make = (deps: DBManagerServiceDeps): DBManagerService => {
  const { postgreRepo } = deps

  const searchUniqueUser = (creds: SignInCreds): Promise<boolean | ApplicationError> => {
    return postgreRepo.searchUserBasedOnCredentials(creds)
  }

  const searchUser = (email: string): Promise<boolean | ApplicationError> => {
    return postgreRepo.searchUserBasedOnEmail(email)
  }

  const createUser = (user: User): Promise<boolean | ApplicationError> => {
    return postgreRepo.createUser(user)
  }

  return {
    createUser,
    searchUniqueUser,
    searchUser
  }
}
