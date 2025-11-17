// create seed data
export const createSeedData = async () => {
  const path = './studentGifts.json'
  const file = Bun.file(path)

  return await file.json()
}
