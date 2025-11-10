import type { ApplicationError } from '../../entities/errors/entity'

export interface PostgreRepository {
  createGifts(gifts: any[]): Promise<boolean | ApplicationError>
}
