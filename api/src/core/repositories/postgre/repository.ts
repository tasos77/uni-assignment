import type { ApplicationError } from '../../entities/errors/entity'
import type { Filters, Gift } from '../../entities/gift/entity'
import type { SignInCreds, SignUpFormData, User } from '../../entities/user/entity'

// postgre repo schema
export interface PostgreRepository {
  createUser: (formData: SignUpFormData) => Promise<boolean | ApplicationError>
  getUser: (email: string) => Promise<User | ApplicationError>
  claimGift: (email: string, giftId: string) => Promise<boolean | ApplicationError>
  updateUser: (user: SignInCreds) => Promise<boolean | ApplicationError>
  createGifts: (gifts: Gift[]) => Promise<boolean | ApplicationError>
  searchUserBasedOnCredentials: (user: SignInCreds) => Promise<boolean | ApplicationError>
  searchUserBasedOnEmail: (email: string) => Promise<boolean | ApplicationError>
  getGifts: (filters: Filters, page: number, sort: string) => Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError>
  searchGifts: (input: string, page: number, sort: string) => Promise<{ gifts: Gift[]; totalCount: number; page: number } | ApplicationError>
}
