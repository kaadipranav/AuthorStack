import { Pool, PoolClient } from 'pg'

/**
 * Azure PostgreSQL Connection Client
 * 
 * Purpose: Sales data, analytics aggregation, metrics, time-series data
 * Pack Benefit: Free access to Azure Database for PostgreSQL while student
 * 
 * Usage:
 * import { query, getClient } from '@/lib/db/postgres'
 * const result = await query('SELECT * FROM sales_data WHERE user_id = $1', [userId])
 */

if (!process.env.DATABASE_URL) {
  throw new Error('Please add DATABASE_URL to environment variables')
}

const poolSize = parseInt(process.env.POSTGRES_POOL_SIZE || '10', 10)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: poolSize,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
})

// Log pool errors
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err)
})

/**
 * Execute a query with automatic connection handling
 */
export async function query<T = unknown>(
  text: string, 
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log('PostgreSQL query:', { text, duration, rows: result.rowCount })
    }
    
    return {
      rows: result.rows as T[],
      rowCount: result.rowCount,
    }
  } catch (error) {
    console.error('PostgreSQL query error:', { text, error })
    throw error
  }
}

/**
 * Get a client from the pool for transactions
 * Remember to release the client when done!
 */
export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect()
  return client
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Get the pool instance (for advanced use cases)
 */
export function getPool(): Pool {
  return pool
}

export default pool
