import { z } from 'zod'

export const SignInRequestBodySchema = z.object({
  email: z.email().meta({
    description: "User's email",
    example: 'user@example.com'
  }),
  password: z.string().min(4).meta({
    description: "User's password",
    example: 'password123'
  })
})

export const SignUpRequestBodySchema = z.object({
  email: z.email().meta({
    description: "User's email",
    example: 'user@example.com'
  }),
  password: z.string().min(4).meta({
    description: "User's password",
    example: 'password123'
  }),
  fullName: z.string().min(2).meta({
    description: "User's full name",
    example: 'John Doe'
  })
})

export const MatchUserRequestBodySchema = z.object({
  email: z.email().meta({
    description: "User's email",
    example: 'user@example.com'
  })
})
