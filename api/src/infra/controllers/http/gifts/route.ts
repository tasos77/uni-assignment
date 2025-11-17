import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { isApplicationError } from '../../../../core/entities/errors/entity'
import type { UniStudentsUsecase } from '../../../../core/usecases/uniStudents/usecase'
import { AuthHeaderSchema, ClaimGiftRequestSchema, GiftsRequestQuerySchema, SearchRequestQuerySchema } from '../schemas/requests'
import { ClaimGiftResponseSchema, GiftsResponseSchema, InternalServerErrorResponseSchema, UnauthorizedResponseSchema } from '../schemas/responses'

// gifts route dependencies schema
interface GiftsRouteDeps {
  uniStudentsUsecase: UniStudentsUsecase
}

// gift route implementation
export const make = (deps: GiftsRouteDeps): Hono => {
  const route = new Hono()
  const { uniStudentsUsecase } = deps

  // gifts endpoint implementation
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
    // validate header
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
    // validate query params
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
      // get token from header
      const { authorization } = c.req.valid('header')
      // get query params
      const { channels, types, brandTitles, category, page, sort } = c.req.valid('query')
      // use usecase
      const result = await uniStudentsUsecase.getGifts(
        authorization,
        {
          channels,
          types,
          brandTitles,
          category
        },
        parseInt(page),
        sort
      )
      // on error throw
      if (isApplicationError(result)) {
        throw result
      }
      // on success return json with data
      return c.json({
        data: result
      })
    }
  )

  // search endpoint implemenation
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
    // validate header
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
    // validate query params
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
      // get token from header
      const { authorization } = c.req.valid('header')
      // get query params
      const { input, page, sort } = c.req.valid('query')
      // use usecase
      const result = await uniStudentsUsecase.searchGifts(authorization, input, parseInt(page), sort)
      // on error throw
      if (isApplicationError(result)) {
        throw result
      }
      // on success return json data
      return c.json({
        data: result
      })
    }
  )

  // claim endpoint implemenation
  route.post(
    '/gifts/claim',
    describeRoute({
      summary: 'Claim gift',
      description: 'Claim gift',
      responses: {
        200: {
          description: 'Gift claimed',
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
    // validate header
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
    // validate body
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
      // get token from header
      const { authorization } = c.req.valid('header')
      // get body
      const { user, gift } = c.req.valid('json')
      // use usecase
      const result = await uniStudentsUsecase.claimGift(authorization, user.email, gift.id)
      // on error throw
      if (isApplicationError(result)) {
        throw result
      }
      // on success return message
      return c.json({
        message: 'Gift claimed successfully'
      })
    }
  )

  return route
}
