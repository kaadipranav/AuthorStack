'use client'

/**
 * useSales Hook
 * 
 * Manages sales data fetching with date range support.
 */

import { useState, useEffect, useCallback } from 'react'
import type { SalesData, DailyAggregate } from '@/types'

type DateRange = '7d' | '30d' | '90d' | 'custom'

interface UseSalesOptions {
  range?: DateRange
  startDate?: Date
  endDate?: Date
  platform?: string
  bookId?: string
}

interface UseSalesReturn {
  sales: SalesData[]
  aggregates: DailyAggregate[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  setRange: (range: DateRange) => void
  triggerSync: () => Promise<void>
}

export function useSales(options: UseSalesOptions = {}): UseSalesReturn {
  const [sales, setSales] = useState<SalesData[]>([])
  const [aggregates, setAggregates] = useState<DailyAggregate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [range, setRange] = useState<DateRange>(options.range || '30d')

  const fetchSales = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const params = new URLSearchParams({ range })
      if (options.platform) params.set('platform', options.platform)
      if (options.bookId) params.set('bookId', options.bookId)
      
      const response = await fetch(`/api/sales?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch sales data')
      }
      
      const data = await response.json()
      setSales(data.sales || [])
      setAggregates(data.aggregates || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sales'))
    } finally {
      setIsLoading(false)
    }
  }, [range, options.platform, options.bookId])

  const triggerSync = useCallback(async () => {
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to trigger sync')
      }
      
      // Refetch after sync
      await fetchSales()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sync'))
    }
  }, [fetchSales])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  return {
    sales,
    aggregates,
    isLoading,
    error,
    refetch: fetchSales,
    setRange,
    triggerSync,
  }
}

export default useSales
