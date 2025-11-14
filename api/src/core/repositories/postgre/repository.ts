import type { ApplicationError } from '../../entities/errors/entity'
import type { Filters, Gift } from '../../entities/gift/entity'
import type { SignInCreds, User } from '../../entities/user/entity'

export interface PostgreRepository {
  createUser: (user: User) => Promise<boolean | ApplicationError>
  updateUser: (user: SignInCreds) => Promise<boolean | ApplicationError>
  createGifts: (gifts: Gift[]) => Promise<boolean | ApplicationError>
  searchUserBasedOnCredentials: (user: SignInCreds) => Promise<boolean | ApplicationError>
  searchUserBasedOnEmail: (email: string) => Promise<boolean | ApplicationError>
  getGifts: (filters: Filters) => Promise<Gift[] | ApplicationError>
  searchGifts: (input: string) => Promise<Gift[] | ApplicationError>
}
