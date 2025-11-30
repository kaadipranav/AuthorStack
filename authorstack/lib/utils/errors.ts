/**
 * Error Handling Utilities
 * 
 * Standardized error handling across the application.
 * All errors should be wrapped in AppError for consistent API responses.
 */

/**
 * Custom application error class
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Common error types
 */
export const Errors = {
  // Authentication errors
  UNAUTHORIZED: new AppError('Unauthorized', 401, 'UNAUTHORIZED'),
  FORBIDDEN: new AppError('Forbidden', 403, 'FORBIDDEN'),
  INVALID_CREDENTIALS: new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS'),
  SESSION_EXPIRED: new AppError('Session expired', 401, 'SESSION_EXPIRED'),

  // Validation errors
  VALIDATION_ERROR: (message: string) => new AppError(message, 400, 'VALIDATION_ERROR'),
  INVALID_INPUT: new AppError('Invalid input', 400, 'INVALID_INPUT'),

  // Resource errors
  NOT_FOUND: (resource: string) => new AppError(`${resource} not found`, 404, 'NOT_FOUND'),
  ALREADY_EXISTS: (resource: string) => new AppError(`${resource} already exists`, 409, 'ALREADY_EXISTS'),

  // Rate limiting
  RATE_LIMITED: new AppError('Too many requests', 429, 'RATE_LIMITED'),

  // Server errors
  INTERNAL_ERROR: new AppError('Internal server error', 500, 'INTERNAL_ERROR'),
  SERVICE_UNAVAILABLE: new AppError('Service unavailable', 503, 'SERVICE_UNAVAILABLE'),
  DATABASE_ERROR: new AppError('Database error', 500, 'DATABASE_ERROR'),

  // Business logic errors
  INSUFFICIENT_CREDITS: new AppError('Insufficient credits', 402, 'INSUFFICIENT_CREDITS'),
  SUBSCRIPTION_REQUIRED: new AppError('Subscription required', 402, 'SUBSCRIPTION_REQUIRED'),
}

/**
 * Check if error is operational (expected) or programming error
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: unknown): {
  error: string
  code: string
  statusCode: number
} {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  // Unknown error - don't expose details in production
  if (process.env.NODE_ENV === 'production') {
    return {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    }
  }

  // In development, include more details
  return {
    error: error instanceof Error ? error.message : 'Unknown error',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  }
}

/**
 * Async error handler wrapper for API routes
 */
export function asyncHandler<T>(
  fn: (...args: unknown[]) => Promise<T>
): (...args: unknown[]) => Promise<T> {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      // Log error (will be sent to Sentry in production)
      console.error('Async handler error:', error)
      throw error
    }
  }
}

/**
 * Create error from Zod validation result
 */
export function createValidationError(issues: { message: string; path: (string | number)[] }[]): AppError {
  const messages = issues.map((issue) => {
    const path = issue.path.join('.')
    return path ? `${path}: ${issue.message}` : issue.message
  })
  
  return new AppError(messages.join('; '), 400, 'VALIDATION_ERROR')
}
