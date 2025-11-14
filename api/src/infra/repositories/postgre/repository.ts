import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '../../../../prisma/generated/client'
import type { ApplicationError } from '../../../core/entities/errors/entity'
import type { Gift } from '../../../core/entities/gift/entity'
import type { SignInCreds, User } from '../../../core/entities/user/entity'
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

  const createUser = async (user: User): Promise<boolean | ApplicationError> => {
    return db.createUser(user)
  }

  const updateUser = async (creds: SignInCreds): Promise<boolean | ApplicationError> => {
    return db.updateUser(creds)
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

  const getGifts = (filters: { channels: string[]; types: string[]; brandTitles: string[] }): Promise<Gift[] | ApplicationError> => {
    return db.getGifts(filters)
  }

  return {
    createUser,
    updateUser,
    createGifts,
    searchUserBasedOnCredentials,
    searchUserBasedOnEmail,
    getGifts
  }
}
