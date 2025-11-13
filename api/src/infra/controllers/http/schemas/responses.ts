import { z } from 'zod'
import { GiftSchema } from '../../../../core/entities/gift/entity'

export const Sign_In_Up_ResponseSchema = z.object({
  token: z.string().meta({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
})

export const OneTimeTokenResponseSchema = z.object({
  token: z.string().meta({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
})

export const GiftsResponseSchema = z.array(GiftSchema)

/// Error responses ///
export const BadRequestResponseSchema = z.union([
  z.object({
    data: z.any(),
    error: z.array(z.any()),
    success: z.boolean()
  }),
  z.string().meta({
    description: 'Malformed JSON in request body',
    example: 'Malformed JSON in request body'
  })
])

export const UnauthorizedResponseSchema = z.object({
  error: z.string().meta({
    description: 'Unauthorized',
    example: 'Unauthorized User'
  })
})

export const InternalServerErrorResponseSchema = z.object({
  error: z.string().meta({
    description: 'Internal Server Error',
    example: 'Internal Server Error'
  })
})

export const PasswordUpdatedResponseSchema = z.object({
  message: z.string().meta({
    description: 'Password updated successfully',
    example: 'Password updated successfully'
  })
})
