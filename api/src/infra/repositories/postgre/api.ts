import type { PrismaClient } from '@prisma/client'
import { type ApplicationError, errors } from '../../../core/entities/errors/entity'
import type { Logger } from '../../utils/logger'

export const api = (db: PrismaClient, logger: Logger) => {
  const checkAccess = async (): Promise<boolean | ApplicationError> => {
    try {
      const result = await db.$executeRaw`SELECT version();`
      logger.info(`Database version ${result}`)
      return true
    } catch (error) {
      return errors.Service('Error checking database access', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Check Access',
        reason: 'Failed to execute raw query',
        value: (error as Error).message
      })
    }
  }

  const createGifts = async (gifts: any[]): Promise<boolean | ApplicationError> => {
    try {
      await db.gift.createMany({
        data: gifts
      })
      return true
    } catch (error) {
      return errors.Service('Error creating gifts', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Create Gifts',
        reason: 'Failed to create gifts',
        value: (error as Error).message
      })
    }
  }

  return {
    checkAccess,
    createGifts
  }
}
