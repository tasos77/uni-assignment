import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from "../../../../prisma/generated/client";
import type { PostgreRepository } from "../../../core/repositories/postgre/repository";
import type { Logger } from "../../utils/logger";
import { api } from "./api";

export interface PostgreRepositoryDeps {
  logger: Logger
}

export const make = async (deps: PostgreRepositoryDeps): Promise<PostgreRepository> =>{
  const { logger } = deps;

  const client = new PrismaClient().$extends(withAccelerate())
  const db = api(client,logger)


    const access = await db.checkAccess()
    if (access instanceof Error) {
      throw new Error('Access denied')
    }

    const createGifts = (gifts : any[]): Promise<boolean| Error> =>{
      return db.createGifts(gifts)
    }

    return {
      createGifts
    }
}
