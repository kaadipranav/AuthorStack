/**
 * Sentry Error Tracking
 * Minimal setup - can be enhanced with @sentry/nextjs later
 */

/**
 * Capture exception (client-side)
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  
  if (!dsn) {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error, context);
    }
    return;
  }

  // Send to Sentry API directly (minimal implementation)
  // In production, use @sentry/nextjs for full features
  try {
    fetch('https://sentry.io/api/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${dsn.split('@')[0].replace('https://', '')}`,
      },
      body: JSON.stringify({
        message: error.message,
        level: 'error',
        contexts: context,
        tags: {
          environment: process.env.NODE_ENV,
        },
      }),
    }).catch(() => {
      // Silently fail if Sentry is not available
    });
  } catch (err) {
    // Silently fail
  }
}

/**
 * Capture exception (server-side)
 */
export function captureServerException(error: Error, context?: Record<string, any>) {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.error('Server Error:', error, context);
    return;
  }

  // Log error (in production, use @sentry/nextjs)
  console.error('Server Error:', error, context);
}

