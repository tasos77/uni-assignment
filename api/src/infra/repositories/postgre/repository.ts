import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '../../../../prisma/generated/client'
import type { ApplicationError } from '../../../core/entities/errors/entity'
import type { Filters, Gift } from '../../../core/entities/gift/entity'
import type { SignInCreds, SignUpFormData, User } from '../../../core/entities/user/entity'
import type { PostgreRepository } from '../../../core/repositories/postgre/repository'
import type { Logger } from '../../utils/logger'
import { api } from './api'

export interface PostgreRepositoryDeps {
  logger: Logger
}

export const make = async (deps: PostgreRepositoryDeps): Promise<PostgreRepository> => {
  const { logger } = deps

  const client = new PrismaClient().$extends(withAccelerate())
  const db = api(client, logger)

  const access = await db.checkAccess()
  if (access instanceof Error) {
    throw new Error('Access denied')
  }

  const createUser = async (formData: SignUpFormData): Promise<boolean | ApplicationError> => {
    return db.createUser(formData)
  }

  const getUser = async (email: string): Promise<User | ApplicationError> => {
    return db.getUser(email)
  }

  const updateUser = async (creds: SignInCreds): Promise<boolean | ApplicationError> => {
    return db.updateUser(creds)
  }

  const claimGift = async (email: string, giftId: string): Promise<boolean | ApplicationError> => {
    return db.claimGift(email, giftId)
  }

  const createGifts = (gifts: Gift[]): Promise<boolean | ApplicationError> => {
    return db.createGifts(gifts)
  }

  const searchUserBasedOnCredentials = (creds: SignInCreds): Promise<boolean | ApplicationError> => {
    return db.searchUserBasedOnCredentials(creds)
  }

  const searchUserBasedOnEmail = (email: string): Promise<boolean | ApplicationError> => {
    return db.searchUserBasedOnEmail(email)
  }

  const getGifts = (filters: Filters, sort: string): Promise<{ gifts: Gift[] } | ApplicationError> => {
    return db.getGifts(filters, sort)
  }

  const searchGifts = (input: string, sort: string): Promise<{ gifts: Gift[] } | ApplicationError> => {
    return db.searchGifts(input, sort)
  }

  return {
    createUser,
    getUser,
    updateUser,
    claimGift,
    createGifts,
    searchUserBasedOnCredentials,
    searchUserBasedOnEmail,
    getGifts,
    searchGifts
  }
}
