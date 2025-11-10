import Link from 'next/link';
import { BookOpen, TrendingUp, Target, Zap, ArrowRight, Check, BarChart3, Users, Rocket } from 'lucide-react';
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-paper paper-texture">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-surface border-b border-stroke backdrop-blur-sm bg-opacity-95">
        <div className="container-custom py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <BookOpen className="w-8 h-8 text-burgundy transition-smooth group-hover:scale-110" />
            <span className="font-heading text-2xl font-bold text-ink">AuthorStack</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-custom py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy bg-opacity-10 border border-burgundy rounded-full mb-8">
            <Users size={16} className="text-burgundy" />
            <span className="text-sm font-medium text-burgundy">Join 500+ indie authors growing their book business</span>
          </div>
          
          <h1 className="font-heading text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
            Your Book Business,
            <br />
            <span className="text-burgundy">Beautifully Organized</span>
          </h1>
          
          <p className="text-xl text-charcoal mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop juggling 10 different platforms. AuthorStack brings all your sales data, competitor insights, and launch tools into one elegant dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="group">
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-smooth" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              <BarChart3 size={20} />
              View Live Demo
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-charcoal">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-forest" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-forest" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-forest" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-ink mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-charcoal max-w-2xl mx-auto">Built by authors, for authors. Every feature designed to save you time and grow your revenue.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Unified Dashboard',
                description: 'See all your sales from Amazon KDP, Gumroad, Apple Books, and more in one elegant view',
                stat: '10+ platforms',
              },
              {
                icon: Target,
                title: 'Competitor Tracking',
                description: 'Monitor competitor prices and rankings. Get instant alerts when they make changes',
                stat: 'Real-time alerts',
              },
              {
                icon: Rocket,
                title: 'Launch Checklists',
                description: 'Pre-built 30/60/90 day templates ensure you never miss a critical launch task',
                stat: '50+ tasks',
              },
              {
                icon: Zap,
                title: 'A/B Testing',
                description: 'Test different covers, titles, and descriptions to find what sells best',
                stat: 'Boost sales 30%',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group bg-surface border border-stroke rounded-card p-6 hover:shadow-elevated transition-smooth duration-normal cursor-pointer">
                  <div className="w-12 h-12 bg-burgundy bg-opacity-10 rounded-card flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-smooth">
                    <Icon className="w-6 h-6 text-burgundy" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-ink mb-2">{feature.title}</h3>
                  <p className="text-charcoal text-sm mb-3 leading-relaxed">{feature.description}</p>
                  <span className="inline-block px-2 py-1 bg-glass rounded text-xs font-medium text-burgundy">{feature.stat}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-ink mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-charcoal">Start free, upgrade as you grow. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['1 Book', '1 Platform', 'Basic Dashboard', 'Launch Checklist'],
                cta: 'Start Free',
              },
              {
                name: 'Pro',
                price: '$19',
                period: '/month',
                badge: 'Most Popular',
                features: [
                  'Unlimited Books',
                  'All Platforms',
                  'Competitor Tracking',
                  'A/B Testing',
                  'Email Alerts',
                  'Priority Support',
                ],
                highlighted: true,
                cta: 'Start 14-Day Trial',
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
                cta: 'Contact Sales',
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`relative bg-surface border rounded-card p-8 ${
                  plan.highlighted ? 'border-burgundy shadow-elevated scale-105' : 'border-stroke'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-burgundy text-white text-xs font-medium rounded-full">
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-heading text-2xl font-bold text-ink mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="font-mono text-5xl font-bold text-ink">{plan.price}</span>
                  {plan.period && <span className="text-charcoal">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-forest flex-shrink-0" />
                      <span className="text-charcoal">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button variant={plan.highlighted ? 'primary' : 'secondary'} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-burgundy text-white py-20">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl font-bold mb-6">Ready to Grow Your Book Business?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join hundreds of indie authors who are using AuthorStack to manage their sales and launches.
          </p>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg" className="bg-white text-burgundy hover:bg-opacity-90">
              Start Free Today
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-charcoal py-12 border-t border-stroke">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-burgundy" />
                <span className="font-heading text-lg font-bold text-white">AuthorStack</span>
              </div>
              <p className="text-sm leading-relaxed">The all-in-one dashboard for indie authors to manage, track, and grow their book business.</p>
            </div>
            <div>
              <h4 className="font-heading text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition-smooth">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-smooth">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/auth/signup" className="hover:text-white transition-smooth">
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-smooth">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-smooth">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-smooth">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-smooth">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-smooth">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stroke pt-8 text-center">
            <p className="text-sm">&copy; 2024 AuthorStack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
