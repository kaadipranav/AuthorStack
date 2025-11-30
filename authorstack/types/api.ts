/**
 * API Response Types
 * 
 * TypeScript types for API requests and responses.
 */

import type { 
  User, 
  Book, 
  SalesData, 
  DailyAggregate, 
  SyncLog,
  Platform 
} from './database'

// ============================================
// Generic API Types
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

export interface ApiError {
  message: string
  code: string
  details?: unknown
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ============================================
// Auth API Types
// ============================================

export interface AuthResult {
  success: boolean
  userId?: string
  sessionId?: string
  error?: string
}

export interface CreateUserInput {
  email: string
  password: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  sessionId: string
}

// ============================================
// Book API Types
// ============================================

export interface CreateBookInput {
  title: string
  subtitle?: string
  author: string
  description?: string
  isbn?: string
  asin?: string
  coverUrl?: string
  genres?: string[]
  platforms?: Platform[]
  publishedDate?: string
  metadata?: Record<string, unknown>
}

export interface UpdateBookInput extends Partial<CreateBookInput> {
  status?: 'draft' | 'published' | 'archived'
}

export interface BookResponse {
  book: Book
}

export interface BooksListResponse {
  books: Book[]
  total: number
}

// ============================================
// Sales API Types
// ============================================

export interface SalesQueryParams {
  startDate: Date
  endDate: Date
  platform?: Platform
  bookId?: string
}

export interface SalesResponse {
  sales: SalesData[]
  aggregates: DailyAggregate[]
  range: string
}

export interface SyncResponse {
  success: boolean
  triggered: string[]
  message: string
}

export interface SyncLogsResponse {
  logs: SyncLog[]
}

// ============================================
// AI API Types
// ============================================

export interface AIInsight {
  id: string
  type: 'trend' | 'opportunity' | 'warning' | 'recommendation' | 'general'
  title: string
  description: string
  confidence: number
  action?: string
  createdAt: Date
}

export interface InsightsResponse {
  insights: AIInsight[]
  generatedAt: Date
}

export interface PricingRecommendation {
  recommendedPrice: number
  confidence: number
  reasoning: string
  alternatives: Array<{
    price: number
    scenario: string
  }>
  factors?: string[]
}

export interface RevenueForecast {
  predictedRevenue: number
  confidence: number
  factors: string[] | string
  risks?: string[]
  dailyPredictions: Array<{
    date: string
    revenue: number
    confidence: number
  }>
}

// ============================================
// Dashboard API Types
// ============================================

export interface DashboardOverview {
  revenue: {
    total: number
    change: number // percentage
    period: string
  }
  units: {
    total: number
    change: number
  }
  pageReads: {
    total: number
    change: number
  }
  activeLaunches: number
  topBooks: Array<{
    id: string
    title: string
    revenue: number
    units: number
  }>
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'sync' | 'sale' | 'launch' | 'milestone'
  message: string
  timestamp: Date
}

// ============================================
// User API Types
// ============================================

export interface UpdateUserInput {
  name?: string
  preferences?: Partial<{
    emailNotifications: boolean
    weeklyDigest: boolean
    theme: 'light' | 'dark' | 'system'
    timezone: string
    currency: string
  }>
}

export interface UserResponse {
  user: User
}

// ============================================
// Webhook Types
// ============================================

export interface StripeWebhookEvent {
  type: string
  data: {
    object: unknown
  }
}
