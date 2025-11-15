import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { isApplicationError } from '../../../../core/entities/errors/entity'
import type { UniStudentsUsecase } from '../../../../core/usecases/uniStudents/usecase'
import { AuthHeaderSchema, ClaimGiftRequestSchema, GiftsRequestQuerySchema, SearchRequestQuerySchema } from '../schemas/requests'
import { ClaimGiftResponseSchema, GiftsResponseSchema, InternalServerErrorResponseSchema, UnauthorizedResponseSchema } from '../schemas/responses'

interface GiftsRouteDeps {
  uniStudentsUsecase: UniStudentsUsecase
}

export const make = (deps: GiftsRouteDeps): Hono => {
  const route = new Hono()
  const { uniStudentsUsecase } = deps

  route.get(
    '/gifts',
    describeRoute({
      summary: 'Get filtered gifts',
      description: 'Get filtered gifts from the database',
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
    validator('header', AuthHeaderSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid authorization token'
          },
          400
        )
      }
    }),
    validator('query', GiftsRequestQuerySchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid query params'
          },
          400
        )
      }
    }),
    async (c) => {
      const { authorization } = c.req.valid('header')
      const { channels, types, brandTitles, category, page } = c.req.valid('query')

      const result = await uniStudentsUsecase.getGifts(
        authorization,
        {
          channels,
          types,
          brandTitles,
          category
        },
        parseInt(page)
      )
      if (isApplicationError(result)) {
        throw result
      }
      return c.json({
        data: result
      })
    }
  )

  route.get(
    '/gifts/search',
    describeRoute({
      summary: 'Get search results',
      description: 'Get gifts that match the search criteria',
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
    validator('header', AuthHeaderSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid authorization token'
          },
          400
        )
      }
    }),
    validator('query', SearchRequestQuerySchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid query params'
          },
          400
        )
      }
    }),
    async (c) => {
      const { authorization } = c.req.valid('header')
      const { input, page } = c.req.valid('query')
      const result = await uniStudentsUsecase.searchGifts(authorization, input, parseInt(page))
      if (isApplicationError(result)) {
        throw result
      }
      return c.json({
        data: result
      })
    }
  )

  route.post(
    '/gifts/claim',
    describeRoute({
      summary: 'Claim gift',
      description: 'Claim gift',
      responses: {
        200: {
          description: 'User found',
          content: {
            'application/json': {
              schema: resolver(ClaimGiftResponseSchema)
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
    validator('header', AuthHeaderSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid authorization token'
          },
          400
        )
      }
    }),
    validator('json', ClaimGiftRequestSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid query params'
          },
          400
        )
      }
    }),
    async (c) => {
      const { authorization } = c.req.valid('header')
      const { user, gift } = c.req.valid('json')
      const result = await uniStudentsUsecase.claimGift(authorization, user.email, gift.id)
      if (isApplicationError(result)) {
        throw result
      }
      return c.json({
        message: 'Gift claimed successfully'
      })
    }
  )

  return route
}
