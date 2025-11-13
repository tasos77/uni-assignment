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

export const AuthHeaderSchema = z.object({
  authorization: z.string().meta({
    description: 'Authorization header',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
})
