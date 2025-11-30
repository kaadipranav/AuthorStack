import { ObjectId } from 'mongodb'
import { getMongoDb } from '@/lib/db/mongodb'
import { cache, CACHE_KEYS } from '@/lib/db/redis'
import { AppError } from '@/lib/utils/errors'
import type { User, UpdateUserInput, UserPreferences } from '@/types'

/**
 * User Service
 * 
 * Handles user profile and preferences operations.
 * User auth is managed by Appwrite, profile data in MongoDB.
 * 
 * Strategy:
 * - Auth data in Appwrite (FREE Pro via Pack)
 * - Profile/preferences in MongoDB (M0 free tier)
 * - Cache user data in Redis for performance
 */

const COLLECTION = 'users'
const CACHE_TTL = 300 // 5 minutes

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    // Check cache first
    const cached = await cache.get<User>(CACHE_KEYS.USER(userId))
    if (cached) {
      return cached
    }

    const db = await getMongoDb()
    const user = await db.collection(COLLECTION).findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return null
    }

    const result: User = {
      id: user._id.toString(),
      authId: user.authId,
      email: user.email,
      name: user.name,
      subscriptionTier: user.subscriptionTier,
      credits: user.credits,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    // Cache the result
    await cache.set(CACHE_KEYS.USER(userId), result, CACHE_TTL)

    return result
  } catch (error) {
    console.error('Get user error:', error)
    throw new AppError('Failed to get user', 500, 'USER_FETCH_FAILED')
  }
}

/**
 * Get user by auth ID (Appwrite ID)
 */
export async function getUserByAuthId(authId: string): Promise<User | null> {
  try {
    const db = await getMongoDb()
    const user = await db.collection(COLLECTION).findOne({ authId })

    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      authId: user.authId,
      email: user.email,
      name: user.name,
      subscriptionTier: user.subscriptionTier,
      credits: user.credits,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  } catch (error) {
    console.error('Get user by auth ID error:', error)
    throw new AppError('Failed to get user', 500, 'USER_FETCH_FAILED')
  }
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, input: UpdateUserInput): Promise<User> {
  try {
    const db = await getMongoDb()

    const updates = {
      ...input,
      updatedAt: new Date(),
    }

    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updates },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND')
    }

    // Invalidate cache
    await cache.del(CACHE_KEYS.USER(userId))

    return {
      id: result._id.toString(),
      authId: result.authId,
      email: result.email,
      name: result.name,
      subscriptionTier: result.subscriptionTier,
      credits: result.credits,
      preferences: result.preferences,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Update user error:', error)
    throw new AppError('Failed to update user', 500, 'USER_UPDATE_FAILED')
  }
}

/**
 * Update user preferences
 */
export async function updatePreferences(
  userId: string, 
  preferences: Partial<UserPreferences>
): Promise<void> {
  try {
    const db = await getMongoDb()

    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          preferences,
          updatedAt: new Date(),
        } 
      }
    )

    // Invalidate cache
    await cache.del(CACHE_KEYS.USER(userId))
  } catch (error) {
    console.error('Update preferences error:', error)
    throw new AppError('Failed to update preferences', 500, 'PREFERENCES_UPDATE_FAILED')
  }
}

/**
 * Add credits to user account
 */
export async function addCredits(userId: string, amount: number): Promise<number> {
  try {
    const db = await getMongoDb()

    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { 
        $inc: { credits: amount },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND')
    }

    // Invalidate cache
    await cache.del(CACHE_KEYS.USER(userId))

    return result.credits
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Add credits error:', error)
    throw new AppError('Failed to add credits', 500, 'CREDITS_ADD_FAILED')
  }
}

/**
 * Deduct credits from user account
 */
export async function deductCredits(userId: string, amount: number): Promise<number> {
  try {
    const db = await getMongoDb()

    // Check if user has enough credits
    const user = await getUserById(userId)
    if (!user || user.credits < amount) {
      throw new AppError('Insufficient credits', 400, 'INSUFFICIENT_CREDITS')
    }

    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(userId), credits: { $gte: amount } },
      { 
        $inc: { credits: -amount },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new AppError('Failed to deduct credits', 400, 'CREDITS_DEDUCT_FAILED')
    }

    // Invalidate cache
    await cache.del(CACHE_KEYS.USER(userId))

    return result.credits
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Deduct credits error:', error)
    throw new AppError('Failed to deduct credits', 500, 'CREDITS_DEDUCT_FAILED')
  }
}

/**
 * Update user subscription tier
 */
export async function updateSubscription(
  userId: string, 
  tier: 'free' | 'starter' | 'professional' | 'enterprise'
): Promise<void> {
  try {
    const db = await getMongoDb()

    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          subscriptionTier: tier,
          updatedAt: new Date(),
        } 
      }
    )

    // Invalidate cache
    await cache.del(CACHE_KEYS.USER(userId))
  } catch (error) {
    console.error('Update subscription error:', error)
    throw new AppError('Failed to update subscription', 500, 'SUBSCRIPTION_UPDATE_FAILED')
  }
}
