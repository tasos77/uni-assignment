import { z } from 'zod'
import { GiftSchema } from '../gift/entity'

const SignUpFormDataSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  fullName: z.string().min(2)
})

const SignInCredsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
})

export const UserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  claimedGifts: z.array(GiftSchema).optional()
})

export type SignUpFormData = z.infer<typeof SignUpFormDataSchema>
export type SignInCreds = z.infer<typeof SignInCredsSchema>
export type User = z.infer<typeof UserSchema>
