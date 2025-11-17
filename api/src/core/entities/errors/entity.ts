// entity not found error schema
interface EntityNotFoundError {
  kind: 'EntityNotFound'
  details: {
    query: string
    system: string
  }
}

// validation error schema
interface ValidationError {
  kind: 'Validation'
  details: {
    issues: Array<{
      path: string
      reason: string
      value: string
    }>
  }
}

// service error schema
interface ServiceError {
  kind: 'Service'
  details: {
    type: 'Internal' | 'External'
    serviceName: string
    system: string
    reason: string
    value: string
    path?: string
  }
}

// unknown error schema
interface UnknownError {
  kind: 'Unknown'
}

// domain error possible schemas
type DomainError = EntityNotFoundError | ValidationError | ServiceError | UnknownError

// context schema
type ErrorContext = Record<string, string>

// Application error class
export class ApplicationError extends Error {
  details: DomainError
  context: ErrorContext

  // class constructor
  constructor(message: string, details: DomainError, context: ErrorContext = {}) {
    super(message)
    this.details = details
    this.context = context
  }

  // error matcher
  match<T>(pattern: { EntityNotFound: (err: EntityNotFoundError) => T; Validation: (err: ValidationError) => T; Service: (err: ServiceError) => T; Unknown: (err: Error) => T }): T {
    switch (this.details.kind) {
      case 'EntityNotFound':
        return pattern.EntityNotFound(this.details)
      case 'Validation':
        return pattern.Validation(this.details)
      case 'Service':
        return pattern.Service(this.details)
      default:
        return pattern.Unknown(this)
    }
  }
}
// error factory
function makeEntityNotFoundError(context: ErrorContext) {
  return (message: string, details: EntityNotFoundError['details']): ApplicationError => new ApplicationError(message, { kind: 'EntityNotFound', details }, context)
}

function makeValidationError(context: ErrorContext) {
  return (message: string, details: ValidationError['details']): ApplicationError => new ApplicationError(message, { kind: 'Validation', details }, context)
}

function makeServiceError(context: ErrorContext) {
  return (message: string, details: ServiceError['details']): ApplicationError => new ApplicationError(message, { kind: 'Service', details }, context)
}

export const errors = {
  EntityNotFound: (message: string, details: EntityNotFoundError['details'], context: ErrorContext = {}) => makeEntityNotFoundError(context)(message, details),
  Validation: (message: string, details: ValidationError['details'], context: ErrorContext = {}) => makeValidationError(context)(message, details),
  Service: (message: string, details: ServiceError['details'], context: ErrorContext = {}) => makeServiceError(context)(message, details),
  Unknown: (message: string, context: ErrorContext = {}) => new ApplicationError(message, { kind: 'Unknown' }, context)
}
// application error checker
export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError
}
