import { type Config, configSchema } from './schema'

const config: Config = {
  server: {
    port: process.env.SERVER_PORT
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    alg: process.env.ALG
  },
  postgreSql: process.env.DATABASE_URL
}

export const conf = configSchema.parse(config)
