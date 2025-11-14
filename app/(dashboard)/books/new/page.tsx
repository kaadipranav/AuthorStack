'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/Button';

export default function NewBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    genre: '',
    publishedDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/books/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create book');
      }

      const data = await response.json();
      console.log('Book created:', data.book);
      
      // Redirect to books list
      router.push('/books');
    } catch (error) {
      console.error('Error creating book:', error);
      alert(error instanceof Error ? error.message : 'Failed to create book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-paper via-paper to-paper/98 paper-texture">
      <div className="container-custom max-w-2xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/books" className="flex items-center gap-2 text-burgundy hover:text-burgundy/80 transition-smooth mb-4">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Books</span>
          </Link>
          <h1 className="font-heading text-4xl font-bold text-ink mb-2">Add New Book</h1>
          <p className="text-charcoal">Upload and manage your book details</p>
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

            {/* Description */}
            <div>
              <label className="input-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description"
                rows={4}
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
                value={formData.isbn}
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
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="input-label">Book File (Optional)</label>
              <div className="border-2 border-dashed border-stroke rounded-card p-8 text-center hover:border-burgundy transition-smooth cursor-pointer">
                <Upload size={32} className="mx-auto mb-3 text-charcoal" />
                <p className="text-sm text-charcoal mb-1">Drag and drop your file here</p>
                <p className="text-xs text-charcoal/60">or click to browse</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading || !formData.title || !formData.author || !formData.genre}
                className="flex-1"
              >
                {isLoading ? 'Creating...' : 'Create Book'}
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
