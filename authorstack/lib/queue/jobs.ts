import { QUEUES, type QueueName } from './connection'

/**
 * Job Definitions
 * 
 * Define all background job types and their payloads.
 * Jobs are processed by workers defined in workers.ts.
 */

/**
 * Job Types
 */
export const JOB_TYPES = {
  // Data Sync Jobs
  SYNC_PLATFORM: 'sync-platform',
  SYNC_ALL_PLATFORMS: 'sync-all-platforms',
  
  // Analytics Jobs
  AGGREGATE_DAILY: 'aggregate-daily',
  CALCULATE_LEADERBOARD: 'calculate-leaderboard',
  
  // Notification Jobs
  SEND_EMAIL: 'send-email',
  SEND_DIGEST: 'send-digest',
  
  // AI Jobs
  GENERATE_INSIGHTS: 'generate-insights',
  PROCESS_FORECAST: 'process-forecast',
} as const

export type JobType = typeof JOB_TYPES[keyof typeof JOB_TYPES]

/**
 * Job Payloads
 */
export interface SyncPlatformPayload {
  userId: string
  platform: 'kdp' | 'gumroad' | 'apple_books' | 'draft2digital'
  credentials?: {
    accessToken?: string
    refreshToken?: string
  }
}

export interface SyncAllPlatformsPayload {
  userId: string
}

export interface AggregateDailyPayload {
  userId: string
  date: string // ISO date string
}

export interface CalculateLeaderboardPayload {
  period: 'daily' | 'weekly' | 'monthly'
  genre?: string
}

export interface SendEmailPayload {
  to: string
  template: string
  data: Record<string, unknown>
}

export interface SendDigestPayload {
  userId: string
  period: 'daily' | 'weekly'
}

export interface GenerateInsightsPayload {
  userId: string
  bookId?: string
}

export interface ProcessForecastPayload {
  userId: string
  daysAhead: number
}

/**
 * Job payload type map
 */
export type JobPayloads = {
  [JOB_TYPES.SYNC_PLATFORM]: SyncPlatformPayload
  [JOB_TYPES.SYNC_ALL_PLATFORMS]: SyncAllPlatformsPayload
  [JOB_TYPES.AGGREGATE_DAILY]: AggregateDailyPayload
  [JOB_TYPES.CALCULATE_LEADERBOARD]: CalculateLeaderboardPayload
  [JOB_TYPES.SEND_EMAIL]: SendEmailPayload
  [JOB_TYPES.SEND_DIGEST]: SendDigestPayload
  [JOB_TYPES.GENERATE_INSIGHTS]: GenerateInsightsPayload
  [JOB_TYPES.PROCESS_FORECAST]: ProcessForecastPayload
}

/**
 * Map job types to queues
 */
export const JOB_QUEUE_MAP: Record<JobType, QueueName> = {
  [JOB_TYPES.SYNC_PLATFORM]: QUEUES.DATA_SYNC,
  [JOB_TYPES.SYNC_ALL_PLATFORMS]: QUEUES.DATA_SYNC,
  [JOB_TYPES.AGGREGATE_DAILY]: QUEUES.ANALYTICS,
  [JOB_TYPES.CALCULATE_LEADERBOARD]: QUEUES.ANALYTICS,
  [JOB_TYPES.SEND_EMAIL]: QUEUES.NOTIFICATIONS,
  [JOB_TYPES.SEND_DIGEST]: QUEUES.NOTIFICATIONS,
  [JOB_TYPES.GENERATE_INSIGHTS]: QUEUES.AI_PROCESSING,
  [JOB_TYPES.PROCESS_FORECAST]: QUEUES.AI_PROCESSING,
}

/**
 * Add a job to the queue
 * Placeholder - implement with actual BullMQ or alternative
 */
export async function addJob<T extends JobType>(
  jobType: T,
  payload: JobPayloads[T],
  options?: {
    delay?: number
    priority?: number
  }
): Promise<string> {
  // Placeholder implementation
  console.log(`Adding job ${jobType} to queue`, payload, options)
  return `job-${Date.now()}`
}

/**
 * Schedule recurring jobs
 */
export async function scheduleRecurringJobs(): Promise<void> {
  // Placeholder - implement cron-like scheduling
  console.log('Scheduling recurring jobs...')
}
