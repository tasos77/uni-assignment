import { z } from 'zod'

export const GiftSchema = z.object({
  title: z.string(),
  category: z.string(),
  description: z.string(),
  terms: z.string(),
  brandTitle: z.string(),
  brandLogoUrl: z.string(),
  imageUrl: z.string(),
  type: z.string(),
  channel: z.string()
})
