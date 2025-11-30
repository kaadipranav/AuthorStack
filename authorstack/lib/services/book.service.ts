import { ObjectId } from 'mongodb'
import { getMongoDb } from '@/lib/db/mongodb'
import { cache, CACHE_KEYS } from '@/lib/db/redis'
import { AppError } from '@/lib/utils/errors'
import type { Book, CreateBookInput, UpdateBookInput } from '@/types'

/**
 * Book Service
 * 
 * Handles all book-related operations.
 * All book data is stored in MongoDB Atlas.
 * 
 * Strategy:
 * - Use MongoDB M0 free tier (512MB)
 * - Cache frequently accessed books in Redis
 * - Store cover images in DigitalOcean Spaces
 */

const COLLECTION = 'books'
const CACHE_TTL = 300 // 5 minutes

/**
 * Create a new book
 */
export async function createBook(userId: string, input: CreateBookInput): Promise<Book> {
  try {
    const db = await getMongoDb()
    
    const book = {
      userId: new ObjectId(userId),
      title: input.title,
      subtitle: input.subtitle || null,
      author: input.author,
      description: input.description || null,
      isbn: input.isbn || null,
      asin: input.asin || null,
      coverUrl: input.coverUrl || null,
      genres: input.genres || [],
      platforms: input.platforms || [],
      publishedDate: input.publishedDate ? new Date(input.publishedDate) : null,
      status: 'draft' as const,
      metadata: input.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(COLLECTION).insertOne(book)

    return {
      id: result.insertedId.toString(),
      ...book,
      userId: userId,
    } as Book
  } catch (error) {
    console.error('Create book error:', error)
    throw new AppError('Failed to create book', 500, 'BOOK_CREATE_FAILED')
  }
}

/**
 * Get book by ID
 */
export async function getBookById(bookId: string): Promise<Book | null> {
  try {
    // Check cache first
    const cached = await cache.get<Book>(CACHE_KEYS.BOOK(bookId))
    if (cached) {
      return cached
    }

    const db = await getMongoDb()
    const book = await db.collection(COLLECTION).findOne({ _id: new ObjectId(bookId) })

    if (!book) {
      return null
    }

    const result: Book = {
      id: book._id.toString(),
      userId: book.userId.toString(),
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      description: book.description,
      isbn: book.isbn,
      asin: book.asin,
      coverUrl: book.coverUrl,
      genres: book.genres,
      platforms: book.platforms,
      publishedDate: book.publishedDate,
      status: book.status,
      metadata: book.metadata,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }

    // Cache the result
    await cache.set(CACHE_KEYS.BOOK(bookId), result, CACHE_TTL)

    return result
  } catch (error) {
    console.error('Get book error:', error)
    throw new AppError('Failed to get book', 500, 'BOOK_FETCH_FAILED')
  }
}

/**
 * Get all books for a user
 */
export async function getBooksByUserId(userId: string): Promise<Book[]> {
  try {
    const db = await getMongoDb()
    const books = await db
      .collection(COLLECTION)
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return books.map((book) => ({
      id: book._id.toString(),
      userId: book.userId.toString(),
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      description: book.description,
      isbn: book.isbn,
      asin: book.asin,
      coverUrl: book.coverUrl,
      genres: book.genres,
      platforms: book.platforms,
      publishedDate: book.publishedDate,
      status: book.status,
      metadata: book.metadata,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    })) as Book[]
  } catch (error) {
    console.error('Get books error:', error)
    throw new AppError('Failed to get books', 500, 'BOOKS_FETCH_FAILED')
  }
}

/**
 * Update a book
 */
export async function updateBook(bookId: string, input: UpdateBookInput): Promise<Book> {
  try {
    const db = await getMongoDb()

    const updates = {
      ...input,
      updatedAt: new Date(),
    }

    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $set: updates },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND')
    }

    // Invalidate cache
    await cache.del(CACHE_KEYS.BOOK(bookId))

    return {
      id: result._id.toString(),
      userId: result.userId.toString(),
      title: result.title,
      subtitle: result.subtitle,
      author: result.author,
      description: result.description,
      isbn: result.isbn,
      asin: result.asin,
      coverUrl: result.coverUrl,
      genres: result.genres,
      platforms: result.platforms,
      publishedDate: result.publishedDate,
      status: result.status,
      metadata: result.metadata,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    } as Book
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Update book error:', error)
    throw new AppError('Failed to update book', 500, 'BOOK_UPDATE_FAILED')
  }
}

/**
 * Delete a book
 */
export async function deleteBook(bookId: string): Promise<void> {
  try {
    const db = await getMongoDb()
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(bookId) })

    if (result.deletedCount === 0) {
      throw new AppError('Book not found', 404, 'BOOK_NOT_FOUND')
    }

    // Invalidate cache
    await cache.del(CACHE_KEYS.BOOK(bookId))
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Delete book error:', error)
    throw new AppError('Failed to delete book', 500, 'BOOK_DELETE_FAILED')
  }
}
