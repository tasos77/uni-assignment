import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '../../../../prisma/generated/client'
import type { ApplicationError } from '../../../core/entities/errors/entity'
import type { Gift } from '../../../core/entities/gift/entity'
import type { User } from '../../../core/entities/user/entity'
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

  const createGifts = (gifts: Gift[]): Promise<boolean | ApplicationError> => {
    return db.createGifts(gifts)
  }

  const searchUserBasedOnCredentials = (user: User): Promise<boolean | ApplicationError> => {
    return db.searchUserBasedOnCredentials(user)
  }

  return {
    createGifts,
    searchUserBasedOnCredentials
  }
}
