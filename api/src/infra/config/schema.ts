import { z } from 'zod'

const serverSchema = z.object({
  port: z.string()
})

const jwtSchema = z.object({
  jwtSecret: z.string(),
  alg: z.string()
})

const postgresUrlRegex = /^postgres(?:ql)?:\/\/(?:[^:@]+(?::[^:@]*)?@)?[^:/?#]+(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/
const postgreSqlSchema = z.string().regex(postgresUrlRegex, {
  message: 'Invalid PostgreSQL connection URL format'
})

export const configSchema = z.object({
  server: serverSchema,
  jwt: jwtSchema,
  postgreSql: postgreSqlSchema
})

export type Config = z.infer<typeof configSchema>
