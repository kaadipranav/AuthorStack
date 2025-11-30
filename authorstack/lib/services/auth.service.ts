import { createAdminClient, createSessionClient } from '@/lib/db/appwrite'
import { getMongoDb } from '@/lib/db/mongodb'
import { AppError } from '@/lib/utils/errors'
import type { User, AuthResult, CreateUserInput } from '@/types'

/**
 * Authentication Service
 * 
 * Abstracts authentication operations using Appwrite as primary provider.
 * All auth-related operations MUST go through this service.
 * 
 * Strategy:
 * - Use Appwrite Pro (FREE via GitHub Student Pack)
 * - Sync user profile to MongoDB for app-specific data
 * - Fall back to custom JWT if Appwrite unavailable
 */

/**
 * Create a new user account
 */
export async function createUser(input: CreateUserInput): Promise<AuthResult> {
  try {
    const { users } = await createAdminClient()
    
    // Create user in Appwrite
    const appwriteUser = await users.create(
      'unique()',
      input.email,
      undefined, // phone
      input.password,
      input.name
    )

    // Sync to MongoDB for app-specific data
    const db = await getMongoDb()
    await db.collection('users').insertOne({
      authId: appwriteUser.$id,
      authProvider: 'appwrite',
      email: input.email,
      name: input.name,
      subscriptionTier: 'free',
      credits: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return {
      success: true,
      userId: appwriteUser.$id,
    }
  } catch (error) {
    console.error('Create user error:', error)
    throw new AppError('Failed to create user', 500, 'AUTH_CREATE_FAILED')
  }
}

/**
 * Verify user session and return user data
 */
export async function verifySession(sessionId: string): Promise<User | null> {
  try {
    const { account } = await createSessionClient(sessionId)
    const appwriteUser = await account.get()

    // Get full user data from MongoDB
    const db = await getMongoDb()
    const user = await db.collection('users').findOne({ authId: appwriteUser.$id })

    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      authId: appwriteUser.$id,
      email: appwriteUser.email,
      name: appwriteUser.name,
      subscriptionTier: user.subscriptionTier,
      credits: user.credits,
      createdAt: user.createdAt,
    } as User
  } catch (error) {
    console.error('Verify session error:', error)
    return null
  }
}

/**
 * Get user by auth ID
 */
export async function getUserByAuthId(authId: string): Promise<User | null> {
  try {
    const db = await getMongoDb()
    const user = await db.collection('users').findOne({ authId })

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
      createdAt: user.createdAt,
    } as User
  } catch (error) {
    console.error('Get user error:', error)
    throw new AppError('Failed to get user', 500, 'USER_FETCH_FAILED')
  }
}

/**
 * Update user profile
 */
export async function updateUser(
  authId: string, 
  updates: Partial<Pick<User, 'name' | 'subscriptionTier' | 'credits'>>
): Promise<void> {
  try {
    const db = await getMongoDb()
    await db.collection('users').updateOne(
      { authId },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    )
  } catch (error) {
    console.error('Update user error:', error)
    throw new AppError('Failed to update user', 500, 'USER_UPDATE_FAILED')
  }
}

/**
 * Delete user account
 */
export async function deleteUser(authId: string): Promise<void> {
  try {
    const { users } = await createAdminClient()
    
    // Delete from Appwrite
    await users.delete(authId)

    // Delete from MongoDB
    const db = await getMongoDb()
    await db.collection('users').deleteOne({ authId })
  } catch (error) {
    console.error('Delete user error:', error)
    throw new AppError('Failed to delete user', 500, 'USER_DELETE_FAILED')
  }
}
