/**
 * Logging Utility
 * 
 * Structured logging for the application.
 * In production, logs are sent to Sentry and New Relic.
 * 
 * Strategy:
 * - Sentry for error tracking (FREE via Pack)
 * - New Relic for APM (FREE via Pack, $300/month value!)
 * - Console logging in development
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  requestId?: string
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
}

/**
 * Format log entry as JSON
 */
function formatLog(entry: LogEntry): string {
  return JSON.stringify(entry)
}

/**
 * Get timestamp in ISO format
 */
function getTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Logger class
 */
class Logger {
  private context: LogContext = {}

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    const child = new Logger()
    child.context = { ...this.context, ...context }
    return child
  }

  /**
   * Debug level - only in development
   */
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'development') return
    
    const entry: LogEntry = {
      level: 'debug',
      message,
      timestamp: getTimestamp(),
      context: { ...this.context, ...context },
    }
    console.log(formatLog(entry))
  }

  /**
   * Info level - general information
   */
  info(message: string, context?: LogContext): void {
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: getTimestamp(),
      context: { ...this.context, ...context },
    }
    console.log(formatLog(entry))
  }

  /**
   * Warn level - potential issues
   */
  warn(message: string, context?: LogContext): void {
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: getTimestamp(),
      context: { ...this.context, ...context },
    }
    console.warn(formatLog(entry))
  }

  /**
   * Error level - errors that need attention
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: getTimestamp(),
      context: { ...this.context, ...context },
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    console.error(formatLog(entry))

    // In production, this would also send to Sentry
    // Sentry.captureException(error, { extra: entry.context })
  }

  /**
   * Log API request
   */
  request(method: string, path: string, context?: LogContext): void {
    this.info(`${method} ${path}`, context)
  }

  /**
   * Log API response
   */
  response(method: string, path: string, status: number, duration: number, context?: LogContext): void {
    this.info(`${method} ${path} ${status} ${duration}ms`, context)
  }

  /**
   * Log database query
   */
  query(query: string, duration: number, context?: LogContext): void {
    this.debug(`DB Query: ${query.substring(0, 100)}... (${duration}ms)`, context)
  }

  /**
   * Log external API call
   */
  external(service: string, method: string, duration: number, context?: LogContext): void {
    this.info(`External: ${service}.${method} (${duration}ms)`, context)
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger()

/**
 * Create a request-scoped logger
 */
export function createRequestLogger(requestId: string, userId?: string): Logger {
  return logger.child({ requestId, userId })
}

export default logger
