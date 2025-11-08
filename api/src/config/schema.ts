import { z } from 'zod'

const serverSchema = z.object({
  port: z.string()
})

const postgresUrlRegex = /^postgres(?:ql)?:\/\/(?:[^:@]+(?::[^:@]*)?@)?[^:/?#]+(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/
const postgreSqlSchema = z.string().regex(postgresUrlRegex, {
  message: 'Invalid PostgreSQL connection URL format'
})

export const configSchema = z.object({
  server: serverSchema,
  postgreSql: postgreSqlSchema
})

export type Config = z.infer<typeof configSchema>
