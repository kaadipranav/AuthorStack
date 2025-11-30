import { z } from 'zod'

/**
 * Zod Validation Schemas
 * 
 * All input validation MUST use Zod schemas.
 * These schemas are used in API routes and service layer.
 */

// ============================================
// User Schemas
// ============================================

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
})

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  preferences: z.object({
    emailNotifications: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    timezone: z.string().optional(),
    currency: z.string().optional(),
  }).optional(),
})

// ============================================
// Book Schemas
// ============================================

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title too long'),
  subtitle: z.string().max(500).optional(),
  author: z.string().min(1, 'Author is required').max(200),
  description: z.string().max(5000).optional(),
  isbn: z.string().regex(/^[\d-]+$/, 'Invalid ISBN format').optional(),
  asin: z.string().length(10, 'ASIN must be 10 characters').optional(),
  coverUrl: z.string().url().optional(),
  genres: z.array(z.string()).max(10).optional(),
  platforms: z.array(z.enum(['kdp', 'gumroad', 'apple_books', 'draft2digital'])).optional(),
  publishedDate: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const updateBookSchema = createBookSchema.partial().extend({
  status: z.enum(['draft', 'published', 'archived']).optional(),
})

export const bookIdSchema = z.object({
  id: z.string().min(1, 'Book ID is required'),
})

// ============================================
// Sales Schemas
// ============================================

export const salesQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  platform: z.enum(['kdp', 'gumroad', 'apple_books', 'draft2digital']).optional(),
  bookId: z.string().optional(),
})

export const insertSalesSchema = z.object({
  bookId: z.string(),
  platform: z.enum(['kdp', 'gumroad', 'apple_books', 'draft2digital']),
  date: z.string().datetime(),
  revenue: z.number().min(0),
  units: z.number().int().min(0),
})

// ============================================
// AI Schemas
// ============================================

export const aiInsightsSchema = z.object({
  bookId: z.string().optional(),
  includeForecasts: z.boolean().optional(),
})

export const pricingRecommendationSchema = z.object({
  bookId: z.string(),
  competitorAsins: z.array(z.string()).max(10).optional(),
})

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = createUserSchema

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const newPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// ============================================
// API Response Schemas
// ============================================

export const apiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
})

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

// ============================================
// Helper Types
// ============================================

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
export type SalesQueryInput = z.infer<typeof salesQuerySchema>
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
