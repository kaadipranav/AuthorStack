'use client'

/**
 * useUser Hook
 * 
 * Manages authenticated user state.
 * Uses Appwrite for session management.
 */

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@/types'

interface UseUserReturn {
  user: User | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Placeholder - implement with Appwrite session check
      // const response = await fetch('/api/auth/me')
      // if (response.ok) {
      //   const data = await response.json()
      //   setUser(data.user)
      // }
      
      setUser(null) // No user for now
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Placeholder - implement with Appwrite logout
      // await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to logout'))
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
    logout,
  }
}

export default useUser
