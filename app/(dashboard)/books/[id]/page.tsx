'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  genre: string;
  published_date?: string;
}

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [formData, setFormData] = useState<Book>({
    id: '',
    title: '',
    author: '',
    isbn: '',
    genre: '',
    published_date: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/books/${bookId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch book');
      }

      const data = await response.json();
      setFormData(data.book);
      setError(null);
    } catch (err) {
      console.error('Error fetching book:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch book');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update book');
      }

      router.push('/books');
    } catch (err) {
      console.error('Error updating book:', err);
      alert(err instanceof Error ? err.message : 'Failed to update book');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/books" className="flex items-center gap-2 text-burgundy hover:text-burgundy/80 transition-smooth">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Books</span>
        </Link>
        <div className="bg-danger/10 border border-danger rounded-card p-4 text-danger">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-paper via-paper to-paper/98 paper-texture">
      <div className="container-custom max-w-2xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/books" className="flex items-center gap-2 text-burgundy hover:text-burgundy/80 transition-smooth mb-4">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Books</span>
          </Link>
          <h1 className="font-heading text-4xl font-bold text-ink mb-2">Edit Book</h1>
          <p className="text-charcoal">Update your book details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface border border-stroke rounded-card p-8 shadow-elevated">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="input-label">Book Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
                className="input-field"
              />
            </div>

            {/* Author */}
            <div>
              <label className="input-label">Author Name *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Enter author name"
                className="input-field"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="input-label">Genre *</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a genre</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="mystery">Mystery</option>
                <option value="romance">Romance</option>
                <option value="sci-fi">Science Fiction</option>
                <option value="fantasy">Fantasy</option>
                <option value="biography">Biography</option>
                <option value="self-help">Self-Help</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* ISBN */}
            <div>
              <label className="input-label">ISBN</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn || ''}
                onChange={handleChange}
                placeholder="Enter ISBN (optional)"
                className="input-field"
              />
            </div>

            {/* Published Date */}
            <div>
              <label className="input-label">Published Date</label>
              <input
                type="date"
                name="published_date"
                value={formData.published_date ? formData.published_date.split('T')[0] : ''}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isSaving || !formData.title || !formData.author || !formData.genre}
                className="flex-1"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.push('/books')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
