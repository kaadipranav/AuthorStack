import { MongoClient, Db } from 'mongodb'

/**
 * MongoDB Atlas Connection Client
 * 
 * Purpose: Core application data (users, books, checklists, community)
 * Pack Benefit: $50 credits + M0 free tier continues
 * 
 * Usage:
 * import { getMongoDb } from '@/lib/db/mongodb'
 * const db = await getMongoDb()
 * const users = db.collection('users')
 */

if (!process.env.MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to environment variables')
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME || 'authorstack'

const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve connection across HMR
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production, create a new client
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

/**
 * Get MongoDB database instance
 */
export async function getMongoDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}

/**
 * Get MongoDB client (for transactions)
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise
}

export default clientPromise
