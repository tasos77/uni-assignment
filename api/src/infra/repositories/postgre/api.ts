import type { PrismaClient } from "@prisma/client";

import type { Logger } from "../../utils/logger";

export const api = (db: PrismaClient, logger:Logger)=>{
  const checkAccess = async() :Promise<boolean| Error> =>{
    try{
      const result = await db.$executeRaw`SELECT version();`
      logger.info(`Database version ${result}`)
      return true
    } catch(error){
      logger.error(`Error checking database access, reason: ${(error as Error).message }`)
      return error as Error
    }
  }

const createGifts = async(gifts: any[]): Promise<boolean| Error> =>{
  try{
    await db.gift.createMany({
      data: gifts
    })
    return true
  } catch(error){
    logger.error(`Error creating gifts, reason: ${(error as Error).message }`)
    return error as Error
  }
}

  return {
    checkAccess,
    createGifts
  }
}
