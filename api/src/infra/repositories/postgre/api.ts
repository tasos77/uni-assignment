import type { PrismaClient } from '@prisma/client'
import { type ApplicationError, errors } from '../../../core/entities/errors/entity'
import type { Gift } from '../../../core/entities/gift/entity'
import type { User } from '../../../core/entities/user/entity'
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

  const searchUserBasedOnEmail = async (email: string): Promise<boolean | ApplicationError> => {
    try {
      const result = await db.user.find({
        where: {
          email
        }
      })
      if (!result) {
        return errors.EntityNotFound('User not found', {
          query: `email: ${email}`,
          system: 'PostgreSQL'
        })
      }
      return true
    } catch (error) {
      return errors.Service('Error searching user by email', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Search User',
        reason: 'Failed to find user based on email',
        value: (error as Error).message
      })
    }
  }

  const searchUserBasedOnCredentials = async (user: User): Promise<boolean | ApplicationError> => {
    try {
      const result = await db.user.findUnique({
        where: {
          email: user.email,
          password: user.password
        }
      })
      if (!result) {
        return errors.EntityNotFound('User not found', {
          query: `email:${user.email},password:${user.password}`,
          system: 'PostgreSQL'
        })
      }
      return true
    } catch (error) {
      return errors.Service('Error getting user', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Search User',
        reason: 'Failed to find user based on credentials',
        value: (error as Error).message
      })
    }
  }

  const createUser = async (user: User): Promise<boolean | ApplicationError> => {
    try {
      await db.user.create({
        data: {
          email: user.email,
          password: user.password
        }
      })
      return true
    } catch (error) {
      return errors.Service('Error creating user', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Create User',
        reason: 'Failed to create user',
        value: (error as Error).message
      })
    }
  }

  const createGifts = async (gifts: Gift[]): Promise<boolean | ApplicationError> => {
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
    createUser,
    createGifts,
    searchUserBasedOnCredentials,
    searchUserBasedOnEmail
  }
}
