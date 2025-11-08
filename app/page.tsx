import Link from 'next/link';
import { BookOpen, TrendingUp, Target, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container-custom py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">AuthorStack</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-custom py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Manage Your Book Business in One Place
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop logging into 10 different platforms. AuthorStack aggregates your sales, tracks
          competitors, and helps you launch books successfully.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3">
            Get Started Free
          </Link>
          <button className="btn-secondary text-lg px-8 py-3">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-16">Why Authors Choose AuthorStack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Unified Dashboard',
                description: 'See all your sales from Amazon, Gumroad, and more in one place',
              },
              {
                icon: Target,
                title: 'Competitor Tracking',
                description: 'Monitor competitor prices and get alerts when they change',
              },
              {
                icon: Zap,
                title: 'Launch Checklists',
                description: 'Pre-built templates to ensure successful book launches',
              },
              {
                icon: BookOpen,
                title: 'A/B Testing',
                description: 'Test different covers and descriptions to maximize sales',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card text-center">
                  <Icon className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['1 Book', '1 Platform', 'Basic Dashboard', 'Launch Checklist'],
              },
              {
                name: 'Pro',
                price: '$19',
                period: '/month',
                features: [
                  'Unlimited Books',
                  'All Platforms',
                  'Competitor Tracking',
                  'A/B Testing',
                  'Email Alerts',
                  'Priority Support',
                ],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: '$49',
                period: '/month',
                features: [
                  'Everything in Pro',
                  'Custom Integrations',
                  'White-label Reports',
                  'API Access',
                  'Dedicated Manager',
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`card ${plan.highlighted ? 'ring-2 ring-accent transform scale-105' : ''}`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={plan.highlighted ? 'btn-accent w-full' : 'btn-secondary w-full'}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Book Business?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of indie authors who are using AuthorStack to manage their sales and
            launches.
          </p>
          <Link href="/auth/signup" className="btn-accent text-lg px-8 py-3">
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">AuthorStack</h4>
              <p>The all-in-one dashboard for indie authors.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 AuthorStack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
