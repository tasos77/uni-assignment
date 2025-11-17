import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { isApplicationError } from '../../../../core/entities/errors/entity'
import type { UniStudentsUsecase } from '../../../../core/usecases/uniStudents/usecase'
import { AuthHeaderSchema, MatchUserRequestBodySchema, SignInRequestBodySchema, SignUpRequestBodySchema } from '../schemas/requests'
import {
  BadRequestResponseSchema,
  InternalServerErrorResponseSchema,
  OneTimeTokenResponseSchema,
  PasswordUpdatedResponseSchema,
  SignInResponseSchema,
  SignUpResponseSchema,
  UnauthorizedResponseSchema
} from '../schemas/responses'

// auth route depedencies
interface AuthRouteDeps {
  uniStudentsUsecase: UniStudentsUsecase
}

// auth route implementation
export const make = (deps: AuthRouteDeps): Hono => {
  const route = new Hono()
  const { uniStudentsUsecase } = deps

  // sign in endpoint implementation
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
              schema: resolver(SignInResponseSchema)
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
    // validate request body
    validator('json', SignInRequestBodySchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid request body'
          },
          400
        )
      }
    }),
    async (c) => {
      // get body
      const { email, password } = await c.req.json()
      // use usecase
      const result = await uniStudentsUsecase.authenticateUser({ email, password })
      if (isApplicationError(result)) {
        // on error throw
        throw result
      }
      // on success return token
      return c.json({
        token: result
      })
    }
  )

  // sign up endpoint implementation
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
              schema: resolver(SignUpResponseSchema)
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
    // validate request body
    validator('json', SignUpRequestBodySchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid request body'
          },
          400
        )
      }
    }),
    async (c) => {
      // get body
      const { email, password, fullName } = await c.req.json()
      // use usecase
      const result = await uniStudentsUsecase.createUser({ email, password, fullName })
      // on error throw
      if (isApplicationError(result)) {
        throw result
      }
      // on success return message
      return c.json({
        message: 'User created successfully'
      })
    }
  )

  // match user endpoint implementation
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
    // validate request body
    validator('json', MatchUserRequestBodySchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid request body'
          },
          400
        )
      }
    }),
    async (c) => {
      // get body
      const { email } = c.req.valid('json')
      // use usecase
      const result = await uniStudentsUsecase.matchUser(email)
      // on error throw
      if (isApplicationError(result)) {
        throw result
      }
      // on success return token
      return c.json({
        token: result
      })
    }
  )

  // update password endpoint implementation
  route.post(
    '/update-password',
    describeRoute({
      summary: 'Update Pass',
      description: 'Update user password',
      responses: {
        200: {
          description: 'Password updated successfully',
          content: {
            'application/json': {
              schema: resolver(PasswordUpdatedResponseSchema)
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
    // validate request body and header
    validator('json', SignInRequestBodySchema),
    validator('header', AuthHeaderSchema),
    async (c) => {
      // get body
      const { email, password } = c.req.valid('json')
      // get token from header
      const { authorization } = c.req.valid('header')
      // use usecase
      const result = await uniStudentsUsecase.updatePassword({ email, password }, authorization)
      // if error throw
      if (isApplicationError(result)) {
        throw result
      }
      // if success return message
      return c.json({
        message: 'Password updated successfully'
      })
    }
  )

  return route
}
