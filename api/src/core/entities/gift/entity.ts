import { z } from 'zod'

// gift schema
export const GiftSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  terms: z.string(),
  brandTitle: z.string(),
  brandLogoUrl: z.string(),
  imageUrl: z.string(),
  type: z.string(),
  channel: z.string(),
  status: z.string()
})

// filters schema
export const FiltersSchema = z.object({
  channels: z.array(z.string()),
  types: z.array(z.string()),
  brandTitles: z.array(z.string()),
  category: z.string()
})

// types infered from schemas
export type Gift = z.infer<typeof GiftSchema>
export type Filters = z.infer<typeof FiltersSchema>
