import type { ApplicationError } from '../../entities/errors/entity'
import type { Filters, Gift } from '../../entities/gift/entity'
import type { SignInCreds, SignUpFormData, User } from '../../entities/user/entity'

export interface PostgreRepository {
  createUser: (formData: SignUpFormData) => Promise<boolean | ApplicationError>
  getUser: (email: string) => Promise<User | ApplicationError>
  claimGift: (email: string, giftId: string) => Promise<boolean | ApplicationError>
  updateUser: (user: SignInCreds) => Promise<boolean | ApplicationError>
  createGifts: (gifts: Gift[]) => Promise<boolean | ApplicationError>
  searchUserBasedOnCredentials: (user: SignInCreds) => Promise<boolean | ApplicationError>
  searchUserBasedOnEmail: (email: string) => Promise<boolean | ApplicationError>
  getGifts: (filters: Filters, sort: string) => Promise<{ gifts: Gift[] } | ApplicationError>
  searchGifts: (input: string, sort: string) => Promise<{ gifts: Gift[] } | ApplicationError>
}
