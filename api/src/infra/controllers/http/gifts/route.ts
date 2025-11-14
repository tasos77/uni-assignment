import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { isApplicationError } from '../../../../core/entities/errors/entity'
import type { AuthUsecase } from '../../../../core/usecases/auth/usecase'
import { AuthHeaderSchema, GiftsRequestQuerySchema } from '../schemas/requests'
import { GiftsResponseSchema, InternalServerErrorResponseSchema, UnauthorizedResponseSchema } from '../schemas/responses'

interface GiftsRouteDeps {
  authUsecase: AuthUsecase
}

export const make = (deps: GiftsRouteDeps) => {
  const route = new Hono()
  const { authUsecase } = deps

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
    validator('header', AuthHeaderSchema),
    validator('query', GiftsRequestQuerySchema),
    async (c) => {
      const { authorization } = c.req.valid('header')
      const { channels, types, brandTitles } = c.req.valid('query')
      const result = await authUsecase.getGifts(authorization, {
        channels,
        types,
        brandTitles
      })
      if (isApplicationError(result)) {
        throw result
      }
      return c.json({
        gifts: result
      })
    }
  )

  return route
}
