import { Client, Account, Databases, Storage, Users } from 'node-appwrite'

/**
 * Appwrite Client Configuration
 * 
 * Purpose: Authentication, realtime subscriptions, user preferences, avatars
 * Pack Benefit: Pro plan ($15/month value) FREE entire student career
 * 
 * Usage:
 * import { createAdminClient, createSessionClient } from '@/lib/db/appwrite'
 * const { account } = await createSessionClient(sessionId)
 * const user = await account.get()
 */

if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
  throw new Error('Please add NEXT_PUBLIC_APPWRITE_ENDPOINT to environment variables')
}

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
  throw new Error('Please add NEXT_PUBLIC_APPWRITE_PROJECT_ID to environment variables')
}

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

/**
 * Create an admin client with API key (server-side only)
 * Use for admin operations like creating users, managing databases
 */
export async function createAdminClient() {
  if (!process.env.APPWRITE_API_KEY) {
    throw new Error('Please add APPWRITE_API_KEY to environment variables')
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(process.env.APPWRITE_API_KEY)

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  }
}

/**
 * Create a session client for authenticated user operations
 * @param sessionId - The user's session ID from cookies/headers
 */
export async function createSessionClient(sessionId: string) {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setSession(sessionId)

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  }
}

/**
 * Appwrite Database IDs
 * Define your database and collection IDs here
 */
export const DATABASE_IDS = {
  MAIN: 'authorstack-main',
} as const

export const COLLECTION_IDS = {
  USER_PREFERENCES: 'user-preferences',
  SESSIONS: 'sessions',
} as const

export const BUCKET_IDS = {
  AVATARS: 'user-avatars',
  BOOK_COVERS: 'book-covers',
} as const
