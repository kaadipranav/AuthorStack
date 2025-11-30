/**
 * Database Models
 * 
 * TypeScript types that mirror the database schemas.
 * MongoDB collections and PostgreSQL tables.
 */

// ============================================
// User Types (MongoDB + Appwrite)
// ============================================

export interface User {
  id: string
  authId: string // Appwrite user ID
  email: string
  name: string
  subscriptionTier: SubscriptionTier
  credits: number
  preferences?: UserPreferences
  createdAt: Date
  updatedAt?: Date
}

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise'

export interface UserPreferences {
  emailNotifications: boolean
  weeklyDigest: boolean
  theme: 'light' | 'dark' | 'system'
  timezone: string
  currency: string
}

// ============================================
// Book Types (MongoDB)
// ============================================

export interface Book {
  id: string
  userId: string
  title: string
  subtitle: string | null
  author: string
  description: string | null
  isbn: string | null
  asin: string | null
  coverUrl: string | null
  genres: string[]
  platforms: Platform[]
  publishedDate: Date | null
  status: BookStatus
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export type BookStatus = 'draft' | 'published' | 'archived'

export type Platform = 'kdp' | 'gumroad' | 'apple_books' | 'draft2digital'

// ============================================
// Sales Types (PostgreSQL)
// ============================================

export interface SalesData {
  id: number
  userId: string
  bookId: string
  platform: Platform
  date: Date
  revenue: number
  units: number
  syncedAt: Date
}

export interface DailyAggregate {
  id: number
  userId: string
  date: Date
  totalRevenue: number
  totalUnits: number
  platformBreakdown: PlatformBreakdown
}

export interface PlatformBreakdown {
  [platform: string]: {
    revenue: number
    units: number
  }
}

export interface SyncLog {
  id: number
  userId: string
  platform: Platform
  status: SyncStatus
  errorMessage: string | null
  syncedAt: Date
}

export type SyncStatus = 'success' | 'partial' | 'failed'

// ============================================
// Community Types (MongoDB)
// ============================================

export interface CommunityPost {
  id: string
  authorId: string
  content: string
  likes: string[] // User IDs
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  authorId: string
  content: string
  createdAt: Date
}

// ============================================
// Marketplace Types (MongoDB)
// ============================================

export interface MarketplaceBoost {
  id: string
  bookId: string
  userId: string
  duration: number // days
  position: number
  active: boolean
  startedAt: Date
  expiresAt: Date
}

// ============================================
// Checklist Types (MongoDB)
// ============================================

export interface Checklist {
  id: string
  bookId: string
  templateId: string
  name: string
  tasks: ChecklistTask[]
  progress: number // 0-100
  createdAt: Date
  updatedAt: Date
}

export interface ChecklistTask {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueDate: Date | null
  completedAt: Date | null
}

// ============================================
// Launch Types (MongoDB)
// ============================================

export interface Launch {
  id: string
  bookId: string
  userId: string
  name: string
  launchDate: Date
  template: LaunchTemplate
  status: LaunchStatus
  checklistId: string
  createdAt: Date
  updatedAt: Date
}

export type LaunchTemplate = '30-day' | '60-day' | '90-day' | 'custom'
export type LaunchStatus = 'planning' | 'active' | 'completed' | 'cancelled'

// ============================================
// Competitor Types (MongoDB)
// ============================================

export interface Competitor {
  id: string
  userId: string
  asin: string
  title: string
  author: string
  currentPrice: number
  priceHistory: PricePoint[]
  lastChecked: Date
  createdAt: Date
}

export interface PricePoint {
  price: number
  date: Date
}
