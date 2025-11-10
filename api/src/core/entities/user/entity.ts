import { z } from 'zod'

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
})

export type User = z.infer<typeof UserSchema>
