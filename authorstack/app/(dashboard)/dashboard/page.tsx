import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your AuthorStack dashboard overview',
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-h2 text-ink">Dashboard</h1>
        <p className="text-body text-charcoal mt-1">
          Welcome back! Here&apos;s your publishing overview.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-lg shadow-elevated">
          <div className="text-small text-muted-foreground">Total Revenue</div>
          <div className="font-mono text-h2 text-ink">$0.00</div>
        </div>
        <div className="p-4 bg-surface rounded-lg shadow-elevated">
          <div className="text-small text-muted-foreground">Units Sold</div>
          <div className="font-mono text-h2 text-ink">0</div>
        </div>
        <div className="p-4 bg-surface rounded-lg shadow-elevated">
          <div className="text-small text-muted-foreground">Page Reads</div>
          <div className="font-mono text-h2 text-ink">0</div>
        </div>
        <div className="p-4 bg-surface rounded-lg shadow-elevated">
          <div className="text-small text-muted-foreground">Active Launches</div>
          <div className="font-mono text-h2 text-ink">0</div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="p-6 bg-surface rounded-lg shadow-elevated">
        <h2 className="font-heading text-h3 text-ink mb-4">Revenue Overview</h2>
        <div className="h-64 flex items-center justify-center border border-stroke rounded-lg">
          <p className="text-muted-foreground">
            No sales yet — connect a platform to see your first dollars.
          </p>
        </div>
      </div>

      {/* Books Table Placeholder */}
      <div className="p-6 bg-surface rounded-lg shadow-elevated">
        <h2 className="font-heading text-h3 text-ink mb-4">Top Performing Books</h2>
        <div className="h-48 flex items-center justify-center border border-stroke rounded-lg">
          <p className="text-muted-foreground">
            Add your first book to start tracking performance.
          </p>
        </div>
      </div>
    </div>
  )
}
