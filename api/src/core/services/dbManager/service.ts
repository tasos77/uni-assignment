import type { ApplicationError } from '../../entities/errors/entity'
import type { User } from '../../entities/user/entity'
import type { PostgreRepository } from '../../repositories/postgre/repository'

export interface DBManagerServiceDeps {
  postgreRepo: PostgreRepository
}

export interface DBManagerService {
  searchUser: (user: User) => Promise<boolean | ApplicationError>
}

export const make = (deps: DBManagerServiceDeps): DBManagerService => {
  const { postgreRepo } = deps

  const searchUser = (user: User): Promise<boolean | ApplicationError> => {
    return postgreRepo.searchUserBasedOnCredentials(user)
  }

  return {
    searchUser
  }
}
