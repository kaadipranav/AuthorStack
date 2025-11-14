'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/Button';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description?: string;
  isbn?: string;
  published_date?: string;
  created_at: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/books');
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data.books || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      setBooks(books.filter(b => b.id !== bookId));
    } catch (err) {
      console.error('Error deleting book:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete book');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-4xl font-bold text-ink mb-2">My Books</h1>
          <p className="text-charcoal">Manage your book catalog</p>
        </div>
        <Link href="/books/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={18} />
            Add Book
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-danger/10 border border-danger rounded-card p-4 text-danger">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <div className="bg-surface border border-stroke rounded-card p-12 text-center">
          <p className="text-charcoal mb-4">No books added yet.</p>
          <Link href="/books/new">
            <Button variant="primary">Create Your First Book</Button>
          </Link>
        </div>
      )}

      {/* Books Grid */}
      {!isLoading && books.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-surface border border-stroke rounded-card p-6 hover:shadow-elevated transition-smooth"
            >
              <div className="mb-4">
                <h3 className="font-heading text-lg font-semibold text-ink mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-charcoal mb-2">{book.author}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-2 py-1 bg-burgundy/10 text-burgundy text-xs font-medium rounded">
                    {book.genre}
                  </span>
                  {book.isbn && (
                    <span className="text-xs text-charcoal/60">ISBN: {book.isbn}</span>
                  )}
                </div>
              </div>

              {book.description && (
                <p className="text-sm text-charcoal mb-4 line-clamp-2">{book.description}</p>
              )}

              {book.published_date && (
                <p className="text-xs text-charcoal/60 mb-4">
                  Published: {new Date(book.published_date).toLocaleDateString()}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-stroke">
                <Link href={`/books/${book.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-2">
                    <Edit2 size={14} />
                    Edit
                  </Button>
                </Link>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="flex-1 px-3 py-2 rounded-card border border-danger text-danger hover:bg-danger/5 transition-smooth text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
