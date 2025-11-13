import type { Context, ErrorHandler } from 'hono'
import { isApplicationError } from '../../../core/entities/errors/entity'

export const onErrorHandler: ErrorHandler = async (err: unknown, c: Context) => {
  if (isApplicationError(err)) {
    if (err.details.kind === 'EntityNotFound') {
      return c.json({ error: err.message }, 400)
    }
    if (err.details.kind === 'Service') {
      return c.json({ error: err.message }, 500)
    }
    return c.json({ error: 'Internal Server Error' }, 500)
  }
  return c.json({ error: 'Unknown Error' }, 500)
}
