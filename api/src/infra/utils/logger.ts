export interface Logger {
  info(message: string): void
  warn(message: string): void
  error(message: string): void
}

export const logger: Logger = {
  info(message: string) {
    console.log(`[INFO] ${message}`)
  },
  warn(message: string) {
    console.warn(`[WARN] ${message}`)
  },
  error(message: string) {
    console.error(`[ERROR] ${message}`)
  }
}
