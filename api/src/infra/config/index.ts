import { type Config, configSchema } from './schema'

const config: Config = {
  server: {
    port: process.env.PORT ?? '3000'
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    alg: process.env.ALG
  },
  postgreSql: process.env.DATABASE_URL
}

export const conf = configSchema.parse(config)
