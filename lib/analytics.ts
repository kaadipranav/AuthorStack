/**
 * Analytics Integration
 * Supports PostHog and Plausible
 */

// PostHog
export function initPostHog() {
  if (typeof window === 'undefined') return;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.log('PostHog not configured (NEXT_PUBLIC_POSTHOG_KEY not set)');
    }
    return;
  }

  // Stub implementation - can be enhanced with @posthog/nextjs later
  // For now, we'll just log that PostHog should be initialized
  // In production, install @posthog/nextjs and use their SDK
  if (process.env.NODE_ENV === 'development') {
    console.log('PostHog stub: Install @posthog/nextjs for full integration');
  }

  // Minimal stub that can be enhanced
  // To enable full PostHog: npm install @posthog/nextjs
  // Then use: import posthog from 'posthog-js'
  // posthog.init(apiKey, { api_host: host })
}

/**
 * Track event (PostHog)
 * Stub implementation - enhance with @posthog/nextjs for full functionality
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Stub: Log event in development
  if (process.env.NODE_ENV === 'development') {
    console.log('PostHog event:', eventName, properties);
  }

  // Full implementation: Use PostHog SDK
  // if (window.posthog) {
  //   window.posthog.capture(eventName, properties);
  // }
}

/**
 * Identify user (PostHog)
 * Stub implementation - enhance with @posthog/nextjs for full functionality
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Stub: Log identification in development
  if (process.env.NODE_ENV === 'development') {
    console.log('PostHog identify:', userId, properties);
  }

  // Full implementation: Use PostHog SDK
  // if (window.posthog) {
  //   window.posthog.identify(userId, properties);
  // }
}

// Plausible
export function initPlausible() {
  if (typeof window === 'undefined') return;

  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  if (!domain) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Plausible not configured (NEXT_PUBLIC_PLAUSIBLE_DOMAIN not set)');
    }
    return;
  }

  // Plausible script injection
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = domain;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
}

/**
 * Track event (Plausible)
 */
export function trackPlausibleEvent(eventName: string, props?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Plausible custom events
  if (window.plausible) {
    window.plausible(eventName, { props });
  }
}

// Type declarations
declare global {
  interface Window {
    posthog?: {
      init: (apiKey: string, config: { api_host: string }) => void;
      capture: (eventName: string, properties?: Record<string, any>) => void;
      identify: (userId: string, properties?: Record<string, any>) => void;
    };
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}

