import { createSeedData } from '../../../infra/utils/createSeedData'
import type { Logger } from '../../../infra/utils/logger'
import { type ApplicationError, isApplicationError } from '../../entities/errors/entity'
import type { PostgreRepository } from '../../repositories/postgre/repository'

// seed depedencies schema
interface SeedServiceDeps {
  logger: Logger
  postgreRepo: PostgreRepository
}

// seed schema
export interface SeedService {
  seed: () => Promise<boolean | Error>
}

// seed service implementation
export const make = (deps: SeedServiceDeps) => {
  const { logger, postgreRepo } = deps

  const seed = async (): Promise<boolean | ApplicationError | Error> => {
    try {
      // get generated gifts
      const gifts = await createSeedData()
      // put them into the database
      const giftsSeedResult = await postgreRepo.createGifts(gifts)
      // if errro log and return the result
      if (isApplicationError(giftsSeedResult)) {
        logger.error(`Failed to execute seed service, reason: ${giftsSeedResult.message}`)
        return giftsSeedResult
      }
      // if success log and return true
      return true
    } catch (error) {
      // catch any error
      logger.error(`Failed to complete seed service, reason: ${(error as Error).message}`)
      return error as Error
    }
  }

  return { seed }
}
