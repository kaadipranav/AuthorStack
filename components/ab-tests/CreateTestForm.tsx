'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Input } from '@/components/Input';
import { useRouter } from 'next/navigation';

interface Book {
  id: string;
  title: string;
}

interface CreateTestFormProps {
  books: Book[];
}

export function CreateTestForm({ books }: CreateTestFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    book_id: '',
    test_type: 'cover',
    target_url: '',
    variants: [
      { name: '', image_url: '', text_content: '' },
      { name: '', image_url: '', text_content: '' },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!formData.book_id || !formData.target_url) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.variants.some((v) => !v.name)) {
        throw new Error('Please name all variants');
      }

      // Prepare variants based on test type
      const variants = formData.variants.map((variant) => {
        if (formData.test_type === 'cover') {
          return {
            name: variant.name,
            image_url: variant.image_url,
          };
        } else {
          return {
            name: variant.name,
            text_content: variant.text_content,
          };
        }
      });

      // Create test
      const response = await fetch('/api/tests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: formData.book_id,
          test_type: formData.test_type,
          target_url: formData.target_url,
          variants,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test');
      }

      // Redirect to test stats page
      router.push(`/ab-tests/${data.test.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: '', image_url: '', text_content: '' }],
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 2) return;
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New A/B Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-900">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book *
            </label>
            <select
              value={formData.book_id}
              onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Type *
            </label>
            <select
              value={formData.test_type}
              onChange={(e) => setFormData({ ...formData, test_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="cover">Cover</option>
              <option value="title">Title</option>
              <option value="description">Description</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target URL (Sales Page) *
            </label>
            <Input
              type="url"
              value={formData.target_url}
              onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
              placeholder="https://example.com/book-sales-page"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variants * (at least 2)
            </label>
            {formData.variants.map((variant, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  {formData.variants.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Name *
                    </label>
                    <Input
                      value={variant.name}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index].name = e.target.value;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                      placeholder="Variant A"
                      required
                    />
                  </div>
                  {formData.test_type === 'cover' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Image URL
                      </label>
                      <Input
                        type="url"
                        value={variant.image_url}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[index].image_url = e.target.value;
                          setFormData({ ...formData, variants: newVariants });
                        }}
                        placeholder="https://example.com/cover-image.jpg"
                      />
                    </div>
                  )}
                  {(formData.test_type === 'title' || formData.test_type === 'description') && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {formData.test_type === 'title' ? 'Title Text' : 'Description Text'}
                      </label>
                      <textarea
                        value={variant.text_content}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[index].text_content = e.target.value;
                          setFormData({ ...formData, variants: newVariants });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                        placeholder={
                          formData.test_type === 'title'
                            ? 'Enter title text'
                            : 'Enter description text'
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addVariant}
              className="mt-2"
            >
              Add Variant
            </Button>
          </div>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Create Test
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

