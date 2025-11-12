import { z } from 'zod'

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  fullName: z.string().min(2)
})

const SignInCredsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
})

export type User = z.infer<typeof UserSchema>
export type SignInCreds = z.infer<typeof SignInCredsSchema>
