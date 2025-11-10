/**
 * Error Handler Utility
 * Centralized error handling with Sentry integration
 */

import { captureException, captureServerException } from '@/lib/sentry';
import { NextResponse } from 'next/server';

/**
 * Handle API route errors
 */
export function handleApiError(error: unknown, context?: Record<string, any>): NextResponse {
  const errorMessage = error instanceof Error ? error.message : 'Internal server error';
  const errorStack = error instanceof Error ? error.stack : undefined;

  // Log error
  console.error('API Error:', errorMessage, context);

  // Capture in Sentry (server-side)
  if (error instanceof Error) {
    captureServerException(error, context);
  }

  // Return error response
  return NextResponse.json(
    {
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
    },
    { status: 500 }
  );
}

/**
 * Handle client-side errors
 */
export function handleClientError(error: Error, context?: Record<string, any>): void {
  console.error('Client Error:', error, context);
  captureException(error, context);
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: Record<string, any>
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status }
  );
}

