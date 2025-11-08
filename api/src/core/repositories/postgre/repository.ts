export interface PostgreRepository {
  createGifts(gifts : any[]) : Promise<boolean| Error>
}
