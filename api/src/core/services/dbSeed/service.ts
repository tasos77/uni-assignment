import { createSeedData } from "../../../infra/utils/createSeedData";
import type { Logger } from "../../../infra/utils/logger";
import type { PostgreRepository } from "../../repositories/postgre/repository";

interface SeedServiceDeps {
  logger: Logger
  postgreRepo : PostgreRepository
}

export interface SeedService {
  seed: () => Promise<boolean|Error>
}

export const make = (deps: SeedServiceDeps)=>{

  const { logger, postgreRepo } = deps;

  const seed = async (): Promise<boolean|Error> =>{
    try{
      const gifts = await createSeedData()
      const giftsSeedResult = await postgreRepo.createGifts(gifts)
      if(giftsSeedResult instanceof Error){
        logger.error(`Failed to execute seed service, reason: ${giftsSeedResult.message}`)
        return giftsSeedResult
      }
      return true
    }catch(error){
      logger.error(`Failed to complete seed service, reason: ${(error as Error).message}`)
      return error as Error
    }
  }

  return { seed }

}
