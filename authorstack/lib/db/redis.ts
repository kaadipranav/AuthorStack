import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

/**
 * Upstash Redis Connection Client
 * 
 * Purpose: Rate limiting, job queues, session cache, real-time features
 * Strategy: Stay on Upstash free tier (10k commands/day)
 * 
 * Usage:
 * import { redis, ratelimit } from '@/lib/db/redis'
 * await redis.set('key', 'value')
 * const { success } = await ratelimit.limit(userId)
 */

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('Please add UPSTASH_REDIS_REST_URL to environment variables')
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Please add UPSTASH_REDIS_REST_TOKEN to environment variables')
}

/**
 * Redis client instance
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

/**
 * Rate limiter for API endpoints
 * Default: 10 requests per 10 seconds per user
 */
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: 'authorstack:ratelimit',
})

/**
 * Stricter rate limiter for AI endpoints
 * 5 requests per minute per user
 */
export const aiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'authorstack:ai-ratelimit',
})

/**
 * Cache helper functions
 */
export const cache = {
  /**
   * Get cached value with automatic JSON parsing
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key)
    return value as T | null
  },

  /**
   * Set cache value with optional TTL (in seconds)
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, JSON.stringify(value))
    } else {
      await redis.set(key, JSON.stringify(value))
    }
  },

  /**
   * Delete cached value
   */
  async del(key: string): Promise<void> {
    await redis.del(key)
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key)
    return result === 1
  },
}

/**
 * Cache key prefixes for organization
 */
export const CACHE_KEYS = {
  USER: (id: string) => `authorstack:user:${id}`,
  BOOK: (id: string) => `authorstack:book:${id}`,
  SALES: (userId: string, range: string) => `authorstack:sales:${userId}:${range}`,
  DASHBOARD: (userId: string) => `authorstack:dashboard:${userId}`,
} as const

export default redis
