import { z } from 'zod'

export const Sign_In_Up_RequestBodySchema = z.object({
  email: z.email().meta({
    description: "User's email",
    example: 'user@example.com'
  }),
  password: z.string().min(4).meta({
    description: "User's password",
    example: 'password123'
  })
})

export const MatchUserRequestBodySchema = z.object({
  email: z.email().meta({
    description: "User's email",
    example: 'user@example.com'
  })
})
