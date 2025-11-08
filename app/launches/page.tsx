'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { CreateLaunchWizard } from '@/components/launches/CreateLaunchWizard';

export default function LaunchesPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{ id: string; title: string } | null>(null);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Book Launches</h1>
        <Button variant="primary" onClick={() => setShowWizard(true)}>
          Create Launch
        </Button>
      </div>

      {showWizard && selectedBook ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Launch</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateLaunchWizard bookId={selectedBook.id} bookTitle={selectedBook.title} />
          </CardContent>
        </Card>
      ) : showWizard ? (
        <Card>
          <CardHeader>
            <CardTitle>Select a Book</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Choose a book to create a launch for:</p>
            <div className="space-y-2">
              <Button
                onClick={() => setSelectedBook({ id: 'book-1', title: 'The Art of Book Marketing' })}
                variant="secondary"
                className="w-full text-left"
              >
                The Art of Book Marketing
              </Button>
              <Button
                onClick={() => setSelectedBook({ id: 'book-2', title: 'Midnight in the Garden' })}
                variant="secondary"
                className="w-full text-left"
              >
                Midnight in the Garden
              </Button>
            </div>
            <Button
              onClick={() => setShowWizard(false)}
              variant="secondary"
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Launches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No launches yet. Click "Create Launch" to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
