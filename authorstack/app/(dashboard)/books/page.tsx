import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Books',
  description: 'Manage your book catalog',
}

export default function BooksPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-h2 text-ink">Books</h1>
          <p className="text-body text-charcoal mt-1">
            Manage your book catalog and track performance
          </p>
        </div>
        <button className="px-4 py-2 bg-burgundy text-white font-body font-semibold rounded-lg hover:bg-burgundy/90 transition-colors duration-normal">
          Add Book
        </button>
      </div>

      {/* Books Grid Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-surface rounded-lg shadow-elevated border-2 border-dashed border-stroke flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground text-center mb-4">
            No books added yet
          </p>
          <button className="text-burgundy font-semibold hover:underline">
            Add your first book
          </button>
        </div>
      </div>
    </div>
  )
}
