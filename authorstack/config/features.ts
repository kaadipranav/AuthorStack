/**
 * Feature Flags
 * 
 * Control feature availability across environments.
 * Use environment variables to enable/disable features.
 */

export const features = {
  // Core features
  auth: {
    enabled: true,
    providers: ['email', 'google', 'github'],
    mfa: false, // Enable in Phase 2
  },

  // Platform integrations
  platforms: {
    kdp: {
      enabled: true,
      csvImport: true,
      apiSync: false, // KDP doesn't have public API
    },
    gumroad: {
      enabled: true,
      oauthSync: true,
    },
    appleBooks: {
      enabled: false, // Enable in Phase 2
      csvImport: true,
    },
    draft2digital: {
      enabled: false, // Enable in Phase 2
    },
  },

  // AI features
  ai: {
    enabled: process.env.OPENROUTER_API_KEY !== undefined,
    insights: true,
    pricing: true,
    forecasting: false, // Enable when we have enough data
  },

  // Community features (Phase 3)
  community: {
    enabled: false,
    posts: false,
    leaderboard: false,
    marketplace: false,
  },

  // Analytics
  analytics: {
    enabled: true,
    simpleAnalytics: true,
    detailedCharts: true,
  },

  // Monetization
  payments: {
    enabled: process.env.STRIPE_SECRET_KEY !== undefined,
    subscriptions: true,
    credits: false, // Enable in Phase 2
  },

  // Experimental
  experimental: {
    mascot: false, // Phase 3
    abTesting: false, // Phase 2
    competitorTracking: false, // Phase 2
  },
} as const

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(path: string): boolean {
  const parts = path.split('.')
  let current: unknown = features
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return false
    }
  }
  
  return current === true
}

export type Features = typeof features
