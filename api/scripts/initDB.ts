import { withAccelerate } from '@prisma/extension-accelerate';
import { $ } from 'bun';
import { PrismaClient } from "../prisma/generated/client";
import { logger } from '../src/infra/utils/logger';

const isDatabaseEmpty = async (client:any): Promise<boolean> => {
  const tablesToCheck = [client.gift.count(), client.user.count()]
  const counts = await Promise.all(tablesToCheck)
  return counts.every((count) => count === 0)
}

const initDB = async () => {
  const client = new PrismaClient().$extends(withAccelerate())

  logger.info('Checking for empty DB... \u{231B}')
  if (await isDatabaseEmpty(client)) {
    logger.info('==== DB is Empty, start seeding! ====')
    await $`bun seed`
  }
}

initDB()
