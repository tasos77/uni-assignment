import type { PostgreRepository } from '../src/core/repositories/postgre/repository'
import type { SeedService } from '../src/core/services/dbSeed/service'
import * as sdService from '../src/core/services/dbSeed/service'
import * as pgRepo from '../src/infra/repositories/postgre/repository'
import { logger } from '../src/infra/utils/logger'

async function seed() {
  /// init repos ///
  logger.info('Init repo... \u{231B}')
  const postgreRepo: PostgreRepository = await pgRepo.make({
    logger
  })

  logger.info('Repo initialized! \u{2705}')

  /// init services ///
  logger.info('Init services... \u{231B}')
  const seedService: SeedService = sdService.make({
    postgreRepo,
    logger
  })
  logger.info('Service initialized! \u{2705}')

  /// init seed process ///
  logger.info('Start Seeding... \u{231B}')
  const result = await seedService.seed()
  if (result instanceof Error) {
    logger.error(`Seeding failed! \u{274C} \nFor reason: ${result}\nDetails: ${result}`)
  } else {
    logger.info('Seeding completed! \u{2705}')
  }
  process.exit()
}

seed()
