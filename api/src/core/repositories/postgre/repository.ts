import type { ApplicationError } from '../../entities/errors/entity'
import type { Gift } from '../../entities/gift/entity'
import type { User } from '../../entities/user/entity'

export interface PostgreRepository {
  createGifts(gifts: Gift[]): Promise<boolean | ApplicationError>
  searchUserBasedOnCredentials(user: User): Promise<boolean | ApplicationError>
}
