import { z } from 'zod'
import { GiftSchema } from '../../../../core/entities/gift/entity'
import { UserSchema } from '../../../../core/entities/user/entity'

export const SignInResponseSchema = z.object({
  token: z.string().meta({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
})

export const SignUpResponseSchema = z.object({
  message: z.string().meta({
    description: 'User created successfully',
    example: 'User created successfully'
  })
})

export const OneTimeTokenResponseSchema = z.object({
  token: z.string().meta({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
})

export const PasswordUpdatedResponseSchema = z.object({
  message: z.string().meta({
    description: 'Password updated successfully',
    example: 'Password updated successfully'
  })
})

export const ClaimGiftResponseSchema = z.object({
  message: z.string().meta({
    description: 'Gift claimed successfully',
    example: 'Gift claimed successfully'
  })
})

export const GiftsResponseSchema = z.object({
  data: z.object({
    gifts: z.array(GiftSchema)
  })
})

export const UserResponseSchema = z.object({
  user: UserSchema
})

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
    example: 'Unauthorized'
  })
})

export const NotFoundResponseSchema = z.object({
  error: z.string().meta({
    description: 'User not found',
    example: 'User not found'
  })
})

export const InternalServerErrorResponseSchema = z.object({
  error: z.string().meta({
    description: 'Internal Server Error',
    example: 'Internal Server Error'
  })
})
