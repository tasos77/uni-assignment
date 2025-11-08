import { configSchema, type Config } from './schema'

const config: Config = {
  server: {
    port: process.env.PORT ?? '3000'
  },
  postgreSql: process.env.DATABASE_URL ?? 'postgresql://admin:admin@localhost:5432/db?schema=public'
}

export const conf = configSchema.parse(config)
