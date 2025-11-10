interface EntityNotFoundError {
  kind: 'EntityNotFound'
  details: {
    query: string
    system: string
  }
}
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

interface StateTransitionError {
  kind: 'StateTransition'
  details: {
    from: string
    to: string
    reason: string
  }
}

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

interface UnknownError {
  kind: 'Unknown'
}

type DomainError = EntityNotFoundError | ValidationError | StateTransitionError | ServiceError | UnknownError

type ErrorContext = Record<string, string>

export class ApplicationError extends Error {
  details: DomainError
  context: ErrorContext

  constructor(message: string, details: DomainError, context: ErrorContext = {}) {
    super(message)
    this.details = details
    this.context = context
  }

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

export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError
}
