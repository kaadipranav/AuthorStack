'use client';

import { useEffect } from 'react';
import { initPostHog, initPlausible } from '@/lib/analytics';

/**
 * Analytics component
 * Initializes PostHog or Plausible based on environment variables
 */
export function Analytics() {
  useEffect(() => {
    // Initialize PostHog if configured
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      initPostHog();
    }

    // Initialize Plausible if configured
    if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      initPlausible();
    }
  }, []);

  return null;
}

