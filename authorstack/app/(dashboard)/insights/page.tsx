import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Insights',
  description: 'AI-powered recommendations and insights',
}

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-h2 text-ink">AI Insights</h1>
        <p className="text-body text-charcoal mt-1">
          AI-powered recommendations to grow your publishing business
        </p>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Pricing Recommendations</h2>
          <div className="p-4 bg-glass rounded-lg">
            <p className="text-muted-foreground">
              Connect platforms and add books to receive AI-powered pricing suggestions.
            </p>
          </div>
        </div>
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Trend Analysis</h2>
          <div className="p-4 bg-glass rounded-lg">
            <p className="text-muted-foreground">
              Once you have sales data, we&apos;ll identify trends and opportunities.
            </p>
          </div>
        </div>
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Revenue Forecast</h2>
          <div className="p-4 bg-glass rounded-lg">
            <p className="text-muted-foreground">
              Predictions will appear once you have 30+ days of sales data.
            </p>
          </div>
        </div>
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Competitor Analysis</h2>
          <div className="p-4 bg-glass rounded-lg">
            <p className="text-muted-foreground">
              Add competitors to track pricing and positioning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
