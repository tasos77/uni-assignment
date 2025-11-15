import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { isApplicationError } from '../../../../core/entities/errors/entity'
import type { UniStudentsUsecase } from '../../../../core/usecases/uniStudents/usecase'
import { AuthHeaderSchema, UserRequestQuerySchema } from '../schemas/requests'
import { InternalServerErrorResponseSchema, UnauthorizedResponseSchema, UserResponseSchema } from '../schemas/responses'

interface UserRouteDeps {
  uniStudentsUsecase: UniStudentsUsecase
}

export const make = (deps: UserRouteDeps): Hono => {
  const route = new Hono()
  const { uniStudentsUsecase } = deps

  route.get(
    '/user',
    describeRoute({
      summary: 'Get user by email',
      description: 'Get user by email',
      responses: {
        200: {
          description: 'User found',
          content: {
            'application/json': {
              schema: resolver(UserResponseSchema)
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
    validator('query', UserRequestQuerySchema, (result, c) => {
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
      const { email } = c.req.valid('query')
      const result = await uniStudentsUsecase.getUser(authorization, email)
      if (isApplicationError(result)) {
        throw result
      }
      return c.json({
        user: result
      })
    }
  )

  return route
}
