/**
 * Application Constants
 * 
 * Reusable constant values across the application.
 */

// ============================================
// Subscription Tiers
// ============================================

export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    limits: {
      books: 3,
      platforms: 1,
      aiInsights: 5, // per month
      storageGb: 0.1,
    },
  },
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 9,
    limits: {
      books: 10,
      platforms: 3,
      aiInsights: 50,
      storageGb: 1,
    },
  },
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    price: 29,
    limits: {
      books: -1, // unlimited
      platforms: -1,
      aiInsights: 500,
      storageGb: 10,
    },
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    limits: {
      books: -1,
      platforms: -1,
      aiInsights: -1,
      storageGb: 100,
    },
  },
} as const

// ============================================
// Platform Configuration
// ============================================

export const PLATFORMS = {
  KDP: {
    id: 'kdp',
    name: 'Amazon KDP',
    icon: 'Amazon',
    color: '#FF9900',
    syncMethod: 'csv',
  },
  GUMROAD: {
    id: 'gumroad',
    name: 'Gumroad',
    icon: 'Gumroad',
    color: '#FF90E8',
    syncMethod: 'oauth',
  },
  APPLE_BOOKS: {
    id: 'apple_books',
    name: 'Apple Books',
    icon: 'Apple',
    color: '#000000',
    syncMethod: 'csv',
  },
  DRAFT2DIGITAL: {
    id: 'draft2digital',
    name: 'Draft2Digital',
    icon: 'D2D',
    color: '#2D9CDB',
    syncMethod: 'csv',
  },
} as const

// ============================================
// Date Ranges
// ============================================

export const DATE_RANGES = {
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '90d': { label: 'Last 90 days', days: 90 },
  '1y': { label: 'Last year', days: 365 },
} as const

// ============================================
// Cache TTLs (in seconds)
// ============================================

export const CACHE_TTL = {
  USER: 300, // 5 minutes
  BOOK: 300,
  SALES: 60, // 1 minute
  DASHBOARD: 60,
  AI_INSIGHT: 3600, // 1 hour
} as const

// ============================================
// Rate Limits
// ============================================

export const RATE_LIMITS = {
  API: {
    requests: 100,
    window: '1m',
  },
  AI: {
    requests: 10,
    window: '1m',
  },
  AUTH: {
    requests: 5,
    window: '1m',
  },
} as const

// ============================================
// File Limits
// ============================================

export const FILE_LIMITS = {
  COVER_IMAGE: {
    maxSizeMb: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    dimensions: { width: 1600, height: 2400 },
  },
  CSV_IMPORT: {
    maxSizeMb: 10,
    allowedTypes: ['text/csv', 'application/vnd.ms-excel'],
  },
} as const

// ============================================
// Genre List
// ============================================

export const GENRES = [
  'Romance',
  'Mystery',
  'Thriller',
  'Science Fiction',
  'Fantasy',
  'Horror',
  'Literary Fiction',
  'Historical Fiction',
  'Young Adult',
  'Middle Grade',
  'Children\'s',
  'Non-Fiction',
  'Self-Help',
  'Business',
  'Biography',
  'Memoir',
  'Poetry',
  'Short Stories',
  'Erotica',
  'Other',
] as const

export type Genre = typeof GENRES[number]
