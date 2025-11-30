import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Sales analytics and insights',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-h2 text-ink">Analytics</h1>
        <p className="text-body text-charcoal mt-1">
          Deep dive into your sales data and trends
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        <button className="px-3 py-1.5 text-small bg-burgundy text-white rounded-lg">7d</button>
        <button className="px-3 py-1.5 text-small border border-stroke rounded-lg hover:bg-glass">30d</button>
        <button className="px-3 py-1.5 text-small border border-stroke rounded-lg hover:bg-glass">90d</button>
        <button className="px-3 py-1.5 text-small border border-stroke rounded-lg hover:bg-glass">Custom</button>
      </div>

      {/* Analytics Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Revenue Over Time</h2>
          <div className="h-64 flex items-center justify-center border border-stroke rounded-lg">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </div>
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Platform Distribution</h2>
          <div className="h-64 flex items-center justify-center border border-stroke rounded-lg">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </div>
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Units by Book</h2>
          <div className="h-64 flex items-center justify-center border border-stroke rounded-lg">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </div>
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Page Reads Trend</h2>
          <div className="h-64 flex items-center justify-center border border-stroke rounded-lg">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
