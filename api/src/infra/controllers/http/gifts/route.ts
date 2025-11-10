import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import { GiftsResponseSchema } from '../schemas/responses'

export const make = () => {
  const route = new Hono()

  route.get(
    '/gifts',
    describeRoute({
      summary: 'Get all gifts',
      description: 'Get all gifts from the database',
      responses: {
        200: {
          description: 'OK',
          content: resolver(GiftsResponseSchema)
        }
      }
    }),
    async (c) => {
      const gifts = [
        {
          id: 1,
          name: 'Gift 1',
          description: 'Description of gift 1',
          price: 10.99,
          image: 'https://example.com/gift1.jpg'
        }
      ]
      return c.json(gifts)
    }
  )

  return route
}
