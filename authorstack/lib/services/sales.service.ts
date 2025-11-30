import { query, transaction } from '@/lib/db/postgres'
import { cache, CACHE_KEYS } from '@/lib/db/redis'
import { AppError } from '@/lib/utils/errors'
import type { 
  SalesData, 
  DailyAggregate, 
  SyncLog, 
  SalesQueryParams,
  PlatformBreakdown 
} from '@/types'

/**
 * Sales Service
 * 
 * Handles all sales data operations.
 * Sales data is stored in Azure PostgreSQL for time-series analytics.
 * 
 * Strategy:
 * - Use Azure PostgreSQL (FREE via Student Pack)
 * - Aggregate daily for efficient queries
 * - Cache frequently accessed data in Redis
 */

const CACHE_TTL = 60 // 1 minute for sales data (more dynamic)

/**
 * Get sales data for a user within a date range
 */
export async function getSalesData(
  userId: string, 
  params: SalesQueryParams
): Promise<SalesData[]> {
  try {
    const { startDate, endDate, platform, bookId } = params
    
    let sql = `
      SELECT id, user_id, book_id, platform, date, revenue, units, synced_at
      FROM sales_data
      WHERE user_id = $1 AND date >= $2 AND date <= $3
    `
    const values: unknown[] = [userId, startDate, endDate]

    if (platform) {
      sql += ` AND platform = $${values.length + 1}`
      values.push(platform)
    }

    if (bookId) {
      sql += ` AND book_id = $${values.length + 1}`
      values.push(bookId)
    }

    sql += ' ORDER BY date DESC'

    const result = await query<SalesData>(sql, values)
    return result.rows
  } catch (error) {
    console.error('Get sales data error:', error)
    throw new AppError('Failed to get sales data', 500, 'SALES_FETCH_FAILED')
  }
}

/**
 * Get aggregated daily data for dashboard
 */
export async function getDailyAggregates(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<DailyAggregate[]> {
  try {
    // Check cache first
    const cacheKey = CACHE_KEYS.SALES(userId, `${startDate.toISOString()}-${endDate.toISOString()}`)
    const cached = await cache.get<DailyAggregate[]>(cacheKey)
    if (cached) {
      return cached
    }

    const result = await query<DailyAggregate>(`
      SELECT id, user_id, date, total_revenue, total_units, platform_breakdown
      FROM daily_aggregates
      WHERE user_id = $1 AND date >= $2 AND date <= $3
      ORDER BY date DESC
    `, [userId, startDate, endDate])

    // Cache the result
    await cache.set(cacheKey, result.rows, CACHE_TTL)

    return result.rows
  } catch (error) {
    console.error('Get daily aggregates error:', error)
    throw new AppError('Failed to get aggregates', 500, 'AGGREGATES_FETCH_FAILED')
  }
}

/**
 * Insert sales data from platform sync
 */
export async function insertSalesData(data: Omit<SalesData, 'id'>[]): Promise<void> {
  try {
    if (data.length === 0) return

    await transaction(async (client) => {
      for (const sale of data) {
        await client.query(`
          INSERT INTO sales_data (user_id, book_id, platform, date, revenue, units, synced_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          ON CONFLICT (user_id, book_id, platform, date) 
          DO UPDATE SET revenue = $5, units = $6, synced_at = NOW()
        `, [sale.userId, sale.bookId, sale.platform, sale.date, sale.revenue, sale.units])
      }
    })
  } catch (error) {
    console.error('Insert sales data error:', error)
    throw new AppError('Failed to insert sales data', 500, 'SALES_INSERT_FAILED')
  }
}

/**
 * Recalculate daily aggregates for a user
 */
export async function recalculateAggregates(userId: string, date: Date): Promise<void> {
  try {
    await transaction(async (client) => {
      // Calculate totals for the day
      const totalsResult = await client.query(`
        SELECT 
          SUM(revenue) as total_revenue,
          SUM(units) as total_units
        FROM sales_data
        WHERE user_id = $1 AND date = $2
      `, [userId, date])

      // Calculate platform breakdown
      const breakdownResult = await client.query(`
        SELECT 
          platform,
          SUM(revenue) as revenue,
          SUM(units) as units
        FROM sales_data
        WHERE user_id = $1 AND date = $2
        GROUP BY platform
      `, [userId, date])

      const platformBreakdown: PlatformBreakdown = {}
      for (const row of breakdownResult.rows) {
        platformBreakdown[row.platform] = {
          revenue: parseFloat(row.revenue),
          units: parseInt(row.units, 10),
        }
      }

      // Upsert aggregate
      await client.query(`
        INSERT INTO daily_aggregates (user_id, date, total_revenue, total_units, platform_breakdown)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id, date)
        DO UPDATE SET 
          total_revenue = $3,
          total_units = $4,
          platform_breakdown = $5
      `, [
        userId,
        date,
        totalsResult.rows[0]?.total_revenue || 0,
        totalsResult.rows[0]?.total_units || 0,
        JSON.stringify(platformBreakdown),
      ])
    })

    // Invalidate cache
    await cache.del(CACHE_KEYS.DASHBOARD(userId))
  } catch (error) {
    console.error('Recalculate aggregates error:', error)
    throw new AppError('Failed to recalculate aggregates', 500, 'AGGREGATES_CALC_FAILED')
  }
}

/**
 * Log a sync operation
 */
export async function logSync(log: Omit<SyncLog, 'id' | 'syncedAt'>): Promise<void> {
  try {
    await query(`
      INSERT INTO sync_logs (user_id, platform, status, error_message, synced_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [log.userId, log.platform, log.status, log.errorMessage])
  } catch (error) {
    console.error('Log sync error:', error)
    // Don't throw - sync logging shouldn't break the main flow
  }
}

/**
 * Get recent sync logs for a user
 */
export async function getSyncLogs(userId: string, limit = 10): Promise<SyncLog[]> {
  try {
    const result = await query<SyncLog>(`
      SELECT id, user_id, platform, status, error_message, synced_at
      FROM sync_logs
      WHERE user_id = $1
      ORDER BY synced_at DESC
      LIMIT $2
    `, [userId, limit])

    return result.rows
  } catch (error) {
    console.error('Get sync logs error:', error)
    throw new AppError('Failed to get sync logs', 500, 'SYNC_LOGS_FETCH_FAILED')
  }
}
