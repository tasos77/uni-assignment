import type { PrismaClient } from '@prisma/client'
import { type ApplicationError, errors } from '../../../core/entities/errors/entity'
import type { Filters, Gift } from '../../../core/entities/gift/entity'
import type { SignInCreds, SignUpFormData, User } from '../../../core/entities/user/entity'
import type { Logger } from '../../utils/logger'

export const api = (db: PrismaClient, logger: Logger) => {
  const checkAccess = async (): Promise<boolean | ApplicationError> => {
    try {
      await db.$executeRaw`SELECT version();`
      logger.info(`DB Connection successful!`)
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
      return errors.Service('Error getting user based on credentials from db', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Search User',
        reason: 'Failed to find user based on credentials',
        value: (error as Error).message
      })
    }
  }

  const createUser = async (user: SignUpFormData): Promise<boolean | ApplicationError> => {
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

  const getUser = async (email: string): Promise<User | ApplicationError> => {
    try {
      const user = await db.user.findUnique({
        where: {
          email
        },
        include: { claimedGifts: true }
      })
      if (!user) {
        return errors.EntityNotFound('User not found', {
          query: `email:${email}`,
          system: 'PostgreSQL'
        })
      }
      return {
        email: user.email,
        fullName: user.fullName,
        claimedGifts: user.claimedGifts
      }
    } catch (error) {
      return errors.Service('Error getting user based on email from db', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Search User',
        reason: 'Failed to find user based on email',
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

  const claimGift = async (email: string, giftId: string): Promise<boolean | ApplicationError> => {
    try {
      await db.user.update({
        where: {
          email
        },
        data: {
          claimedGifts: {
            connect: {
              id: giftId
            }
          }
        }
      })
      return true
    } catch (error) {
      return errors.Service('Error claiming gift', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Claim Gift',
        reason: 'Failed to claim gift',
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

  const getGifts = async (filters: Filters, sort: string): Promise<{ gifts: Gift[] } | ApplicationError> => {
    const where: any = {}
    const sortBy = sort === 'NEW_IN' ? { status: 'asc' } : { status: 'desc' }
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
    if (filters.category.length > 0 && filters.category !== 'All') {
      where.category = filters.category
    }

    try {
      const gifts = await db.gift.findMany({ where, orderBy: sortBy })
      return { gifts }
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

  const searchGifts = async (input: string, sort: string): Promise<{ gifts: Gift[] } | ApplicationError> => {
    const sortBy = sort === 'NEW_IN' ? { status: 'asc' } : { status: 'desc' }
    try {
      const gifts = await db.gift.findMany({
        where: {
          title: { contains: input, mode: 'insensitive' }
        },
        orderBy: sortBy
      })
      return { gifts }
    } catch (error) {
      return errors.Service('Error searching gifts', {
        type: 'External',
        system: 'PostgreSQL',
        serviceName: 'Search Gifts',
        reason: 'Failed to search gifts',
        value: (error as Error).message
      })
    }
  }

  return {
    checkAccess,
    createUser,
    getUser,
    updateUser,
    createGifts,
    searchUserBasedOnCredentials,
    searchUserBasedOnEmail,
    getGifts,
    searchGifts,
    claimGift
  }
}
