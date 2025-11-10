import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { isApplicationError } from '../../../../core/entities/errors/entity'
import type { AuthUsecase } from '../../../../core/usecases/auth/usecase'
import { MatchUserRequestBodySchema, Sign_In_Up_RequestBodySchema } from '../schemas/requests'
import { BadRequestResponseSchema, InternalServerErrorResponseSchema, OneTimeTokenResponseSchema, Sign_In_Up_ResponseSchema, UnauthorizedResponseSchema } from '../schemas/responses'

interface AuthRouteDeps {
  authUsecase: AuthUsecase
}

export const make = (deps: AuthRouteDeps): Hono => {
  const route = new Hono()
  const { authUsecase } = deps

  route.post(
    '/sign-in',
    describeRoute({
      summary: 'Sign in',
      description: 'Sign in with email and password',
      responses: {
        200: {
          description: 'User authenticated successfully',
          content: {
            'application/json': {
              schema: resolver(Sign_In_Up_ResponseSchema)
            }
          }
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: resolver(BadRequestResponseSchema)
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
    validator('json', Sign_In_Up_RequestBodySchema),
    async (c) => {
      const { email, password } = await c.req.json()
      const result = await authUsecase.authenticateUser({ email, password })
      if (isApplicationError(result)) {
        return c.json({
          error: result.message
        })
      }
      return c.json({
        token: result
      })
    }
  )

  route.post(
    '/sign-up',
    describeRoute({
      summary: 'Sign up',
      description: 'Sign up with email and password',
      responses: {
        201: {
          description: 'User created successfully',
          content: {
            'application/json': {
              schema: resolver(Sign_In_Up_ResponseSchema)
            }
          }
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: resolver(BadRequestResponseSchema)
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
    validator('json', Sign_In_Up_RequestBodySchema),
    async (c) => {
      const { email, password } = await c.req.json()
      console.log(email, password)

      return c.json({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cQ.signature'
      })
    }
  )

  route.post(
    '/match-user',
    describeRoute({
      summary: 'Match user',
      description: 'Match user with email',
      responses: {
        200: {
          description: 'User matched successfully',
          content: {
            'application/json': {
              schema: resolver(OneTimeTokenResponseSchema)
            }
          }
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: resolver(BadRequestResponseSchema)
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
    validator('json', MatchUserRequestBodySchema),
    async (c) => {
      const { email } = await c.req.json()
      console.log(email)

      return c.json({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cQ.signature'
      })
    }
  )

  route.post(
    '/update-password',
    describeRoute({
      summary: 'Update Pass',
      description: 'Update user password',
      responses: {
        200: {
          description: 'Password updated successfully'
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: resolver(BadRequestResponseSchema)
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
    validator('json', Sign_In_Up_RequestBodySchema),
    async (c) => {
      const { email, password } = await c.req.json()
      console.log(email, password)

      return c.json({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cQ.signature'
      })
    }
  )

  return route
}
