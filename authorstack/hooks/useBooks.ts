'use client'

/**
 * useBooks Hook
 * 
 * Manages book data fetching and mutations.
 */

import { useState, useEffect, useCallback } from 'react'
import type { Book, CreateBookInput, UpdateBookInput } from '@/types'

interface UseBooksReturn {
  books: Book[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createBook: (input: CreateBookInput) => Promise<Book>
  updateBook: (id: string, input: UpdateBookInput) => Promise<Book>
  deleteBook: (id: string) => Promise<void>
}

export function useBooks(): UseBooksReturn {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBooks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/books')
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      
      const data = await response.json()
      setBooks(data.books || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch books'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createBook = useCallback(async (input: CreateBookInput): Promise<Book> => {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create book')
    }
    
    const data = await response.json()
    setBooks(prev => [data.book, ...prev])
    return data.book
  }, [])

  const updateBook = useCallback(async (id: string, input: UpdateBookInput): Promise<Book> => {
    const response = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update book')
    }
    
    const data = await response.json()
    setBooks(prev => prev.map(b => b.id === id ? data.book : b))
    return data.book
  }, [])

  const deleteBook = useCallback(async (id: string): Promise<void> => {
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete book')
    }
    
    setBooks(prev => prev.filter(b => b.id !== id))
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return {
    books,
    isLoading,
    error,
    refetch: fetchBooks,
    createBook,
    updateBook,
    deleteBook,
  }
}

export default useBooks
