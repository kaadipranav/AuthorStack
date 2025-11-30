import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading text-h1 text-ink mb-6">
              Your Publishing Command Center
            </h1>
            <p className="text-body-lg text-charcoal mb-8 max-w-2xl mx-auto">
              Track sales across all platforms, manage book launches, and get AI-powered insights 
              to grow your indie publishing business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 bg-burgundy text-white font-body font-semibold rounded-lg hover:bg-burgundy/90 transition-colors duration-normal"
              >
                Connect your first platform
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center px-6 py-3 border border-stroke text-ink font-body font-semibold rounded-lg hover:bg-glass transition-colors duration-normal"
              >
                See demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-h2 text-ink text-center mb-16">
            Everything you need to succeed
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 bg-paper rounded-lg shadow-elevated">
              <h3 className="font-heading text-h3 text-ink mb-3">
                Unified Dashboard
              </h3>
              <p className="text-body text-charcoal">
                See all your sales data from KDP, Gumroad, Apple Books, and more in one beautiful dashboard.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-paper rounded-lg shadow-elevated">
              <h3 className="font-heading text-h3 text-ink mb-3">
                Launch Management
              </h3>
              <p className="text-body text-charcoal">
                Plan and execute perfect book launches with customizable checklists and marketing calendars.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-paper rounded-lg shadow-elevated">
              <h3 className="font-heading text-h3 text-ink mb-3">
                AI Insights
              </h3>
              <p className="text-body text-charcoal">
                Get personalized pricing recommendations and trend analysis powered by AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-paper">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-h2 text-ink mb-6">
            Ready to grow your author business?
          </h2>
          <p className="text-body-lg text-charcoal mb-8 max-w-xl mx-auto">
            Join thousands of indie authors who trust AuthorStack to manage their publishing empire.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-burgundy text-white font-body font-semibold rounded-lg hover:bg-burgundy/90 transition-colors duration-normal"
          >
            Start free trial
          </Link>
        </div>
      </section>
    </main>
  )
}
