import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import { GiftsResponseSchema, InternalServerErrorResponseSchema, UnauthorizedResponseSchema } from '../schemas/responses'

export const make = () => {
  const route = new Hono()

  route.get(
    '/gifts',
    describeRoute({
      summary: 'Get all gifts',
      description: 'Get all gifts from the database',
      responses: {
        200: {
          description: 'Returns a list of gifts',
          content: {
            'application/json': {
              schema: resolver(GiftsResponseSchema)
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: resolver(UnauthorizedResponseSchema)
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: resolver(InternalServerErrorResponseSchema)
            }
          }
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
