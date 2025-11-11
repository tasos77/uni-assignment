import type { ApplicationError } from '../../entities/errors/entity'
import type { User } from '../../entities/user/entity'
import type { PostgreRepository } from '../../repositories/postgre/repository'

export interface DBManagerServiceDeps {
  postgreRepo: PostgreRepository
}

export interface DBManagerService {
  searchUniqueUser: (user: User) => Promise<boolean | ApplicationError>
  searchUser: (email: string) => Promise<boolean | ApplicationError>
  createUser: (user: User) => Promise<boolean | ApplicationError>
}

export const make = (deps: DBManagerServiceDeps): DBManagerService => {
  const { postgreRepo } = deps

  const searchUniqueUser = (user: User): Promise<boolean | ApplicationError> => {
    return postgreRepo.searchUserBasedOnCredentials(user)
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
