import type { PrismaClient } from '@prisma/client'
import { type ApplicationError, errors } from '../../../core/entities/errors/entity'
import type { Gift } from '../../../core/entities/gift/entity'
import type { SignInCreds, User } from '../../../core/entities/user/entity'
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
      const result = await db.user.findFirst({
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

  const searchUserBasedOnCredentials = async (creds: SignInCreds): Promise<boolean | ApplicationError> => {
    const { email, password } = creds
    try {
      const result = await db.user.findFirst({
        where: {
          email,
          password
        }
      })
      if (!result) {
        return errors.EntityNotFound('User not found', {
          query: `email:${creds.email},password:${creds.password}`,
          system: 'PostgreSQL'
        })
      }
      return true
    } catch (error) {
      console.log(error)
      return errors.Service('Error getting user based on credentials from db', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Search User',
        reason: 'Failed to find user based on credentials',
        value: (error as Error).message
      })
    }
  }

  const createUser = async (user: User): Promise<boolean | ApplicationError> => {
    const { email, password, fullName } = user
    try {
      await db.user.create({
        data: {
          email,
          password,
          fullName
        }
      })
      return true
    } catch (error) {
      return errors.Service('Error creating user in db', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Create User',
        reason: 'Failed to create user',
        value: (error as Error).message
      })
    }
  }

  const updateUser = async (creds: SignInCreds): Promise<boolean | ApplicationError> => {
    const { email, password } = creds
    try {
      await db.user.update({
        where: {
          email
        },
        data: {
          password
        }
      })
      return true
    } catch (error) {
      return errors.Service('Error updating user in db', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Update User',
        reason: 'Failed to update user',
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

  const getGifts = async (filters: { channels: string[]; types: string[]; brandTitles: string[] }): Promise<Gift[] | ApplicationError> => {
    console.log(filters)
    const where: any = {}
    if (filters.channels.length > 0) {
      where.channel = {
        in: filters.channels
      }
    }
    if (filters.types.length > 0) {
      where.type = {
        in: filters.types
      }
    }
    if (filters.brandTitles.length > 0) {
      where.brandTitle = {
        in: filters.brandTitles
      }
    }

    console.log(where)
    try {
      const gifts = await db.gift.findMany({ where })
      return gifts
    } catch (error) {
      return errors.Service('Error getting gifts', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Get Gifts',
        reason: 'Failed to get gifts',
        value: (error as Error).message
      })
    }
  }

  return {
    checkAccess,
    createUser,
    updateUser,
    createGifts,
    searchUserBasedOnCredentials,
    searchUserBasedOnEmail,
    getGifts
  }
}
