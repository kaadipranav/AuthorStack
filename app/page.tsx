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
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Watermark Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Book Icon Shadow */}
          <svg className="absolute w-96 h-96 text-ink opacity-10 hidden sm:block -rotate-2" viewBox="0 0 200 200" fill="currentColor" style={{ top: '8vh', right: '8vw' }}>
            <path d="M50 20 L150 20 Q160 20 160 30 L160 170 Q160 180 150 180 L50 180 Q40 180 40 170 L40 30 Q40 20 50 20 M100 20 L100 180" strokeWidth="2" stroke="currentColor" fill="none"/>
            <circle cx="100" cy="60" r="8" fill="currentColor"/>
            <path d="M70 80 Q100 90 130 80" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M70 100 Q100 110 130 100" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M70 120 Q100 130 130 120" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
          {/* Quill/Pen Doodle */}
          <svg className="absolute w-64 h-64 text-ink opacity-10 rotate-6" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ bottom: '10vh', left: '6vw' }}>
            <path d="M20 80 Q30 40 50 20 Q70 40 80 80"/>
            <path d="M30 70 L70 70"/>
            <path d="M35 60 L65 60"/>
            <circle cx="50" cy="50" r="15"/>
            <path d="M50 35 L50 65 M35 50 L65 50"/>
          </svg>
          {/* Stack of Books */}
          <svg className="absolute w-80 h-80 text-ink opacity-10 hidden md:block" viewBox="0 0 120 120" fill="currentColor" style={{ top: '48vh', left: '3vw' }}>
            <rect x="20" y="60" width="80" height="12" rx="2"/>
            <rect x="15" y="75" width="90" height="12" rx="2"/>
            <rect x="25" y="90" width="70" height="12" rx="2"/>
            <line x1="20" y1="60" x2="20" y2="72" stroke="currentColor" strokeWidth="1"/>
            <line x1="100" y1="60" x2="100" y2="72" stroke="currentColor" strokeWidth="1"/>
          </svg>
          {/* Coffee Cup */}
          <svg className="absolute w-48 h-48 text-charcoal opacity-5 scale-110" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" style={{ top: '16vh', left: '20vw' }}>
            <path d="M20 40 L20 70 Q20 80 30 80 L60 80 Q70 80 70 70 L70 40"/>
            <path d="M15 40 L75 40"/>
            <path d="M70 50 Q85 50 85 60 Q85 70 70 70"/>
            <path d="M30 25 Q35 30 30 35 M45 25 Q50 30 45 35 M60 25 Q65 30 60 35"/>
          </svg>
          {/* Typewriter */}
          <svg className="absolute w-72 h-72 text-charcoal opacity-10 hidden lg:block -rotate-3" viewBox="0 0 120 100" fill="currentColor" style={{ bottom: '18vh', right: '3vw' }}>
            <rect x="20" y="40" width="80" height="35" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
            <rect x="25" y="45" width="70" height="25" rx="2"/>
            <circle cx="60" cy="30" r="8"/>
            <rect x="30" y="78" width="60" height="8" rx="2"/>
            <line x1="35" y1="50" x2="85" y2="50" stroke="white" strokeWidth="1"/>
            <line x1="35" y1="55" x2="85" y2="55" stroke="white" strokeWidth="1"/>
            <line x1="35" y1="60" x2="85" y2="60" stroke="white" strokeWidth="1"/>
          </svg>
          {/* Notebook/Journal */}
          <svg className="absolute w-56 h-56 text-ink opacity-10 hidden md:block" viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ top: '28vh', right: '18vw' }}>
            <rect x="25" y="20" width="50" height="80" rx="2" fill="currentColor" opacity="0.3"/>
            <line x1="35" y1="20" x2="35" y2="100" strokeWidth="2"/>
            <line x1="40" y1="35" x2="65" y2="35"/>
            <line x1="40" y1="45" x2="65" y2="45"/>
            <line x1="40" y1="55" x2="65" y2="55"/>
            <line x1="40" y1="65" x2="60" y2="65"/>
          </svg>
          {/* Pencil */}
          <svg className="absolute w-40 h-40 text-ink opacity-10 rotate-45" viewBox="0 0 100 100" fill="currentColor" style={{ bottom: '26vh', right: '28vw' }}>
            <polygon points="50,10 45,30 55,30" fill="currentColor"/>
            <rect x="45" y="30" width="10" height="50" fill="currentColor"/>
            <polygon points="45,80 50,90 55,80" fill="currentColor"/>
            <circle cx="50" cy="55" r="3" fill="white"/>
          </svg>
          {/* Open Book */}
          <svg className="absolute w-64 h-64 text-charcoal opacity-10 hidden lg:block" viewBox="0 0 140 100" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ top: '62vh', right: '8vw' }}>
            <path d="M20 30 Q20 50 40 60 L70 70 L70 30 L40 20 Q20 20 20 30" fill="currentColor" opacity="0.2"/>
            <path d="M120 30 Q120 50 100 60 L70 70 L70 30 L100 20 Q120 20 120 30" fill="currentColor" opacity="0.2"/>
            <line x1="30" y1="35" x2="60" y2="40"/>
            <line x1="30" y1="42" x2="60" y2="47"/>
            <line x1="30" y1="49" x2="60" y2="54"/>
            <line x1="80" y1="40" x2="110" y2="35"/>
            <line x1="80" y1="47" x2="110" y2="42"/>
            <line x1="80" y1="54" x2="110" y2="49"/>
          </svg>
          {/* Lightbulb (Ideas) */}
          <svg className="absolute w-44 h-44 text-ink opacity-5" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" style={{ top: '20vh', left: '36vw' }}>
            <circle cx="50" cy="40" r="20" fill="currentColor" opacity="0.2"/>
            <path d="M40 55 L40 65 Q40 70 45 70 L55 70 Q60 70 60 65 L60 55"/>
            <line x1="45" y1="70" x2="45" y2="75"/>
            <line x1="55" y1="70" x2="55" y2="75"/>
            <line x1="42" y1="75" x2="58" y2="75" strokeWidth="3"/>
            <path d="M30 25 L25 20 M70 25 L75 20 M50 15 L50 8 M30 40 L22 40 M70 40 L78 40"/>
          </svg>
          {/* Bookmark */}
          <svg className="absolute w-32 h-32 text-ink opacity-10 hidden sm:block" viewBox="0 0 60 100" fill="currentColor" style={{ bottom: '32vh', left: '22vw' }}>
            <path d="M15 10 L45 10 L45 85 L30 75 L15 85 Z"/>
            <rect x="20" y="20" width="20" height="2" fill="white"/>
            <rect x="20" y="28" width="20" height="2" fill="white"/>
          </svg>

          {/* Quote Marks */}
          <svg className="absolute w-24 h-24 text-charcoal opacity-5" viewBox="0 0 100 60" fill="currentColor" style={{ top: '8vh', left: '46vw' }}>
            <path d="M20 20 Q20 10 30 10 Q40 10 40 20 Q40 30 30 35 Q25 40 25 50 L15 50 Q15 35 20 30 Z"/>
            <path d="M60 20 Q60 10 70 10 Q80 10 80 20 Q80 30 70 35 Q65 40 65 50 L55 50 Q55 35 60 30 Z"/>
          </svg>

          {/* Glasses */}
          <svg className="absolute w-28 h-16 text-ink opacity-10" viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="3" style={{ bottom: '8vh', left: '6vw' }}>
            <circle cx="35" cy="30" r="18"/>
            <circle cx="85" cy="30" r="18"/>
            <line x1="53" y1="30" x2="67" y2="30"/>
            <path d="M5 28 Q20 15 35 18"/>
            <path d="M115 28 Q100 15 85 18"/>
          </svg>

          {/* Paperclip */}
          <svg className="absolute w-16 h-16 text-ink opacity-10 rotate-12" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" style={{ top: '6vh', right: '30vw' }}>
            <path d="M20 36 L40 20 Q48 14 54 20 Q60 26 54 32 L30 52 Q22 58 16 52 Q10 46 16 40 L38 22"/>
          </svg>

          {/* Calendar */}
          <svg className="absolute w-28 h-28 text-charcoal opacity-10 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" style={{ bottom: '14vh', right: '18vw' }}>
            <rect x="15" y="25" width="70" height="60" rx="6"/>
            <line x1="15" y1="40" x2="85" y2="40"/>
            <line x1="30" y1="20" x2="30" y2="35"/>
            <line x1="70" y1="20" x2="70" y2="35"/>
            <rect x="28" y="50" width="12" height="12" rx="2" fill="currentColor"/>
            <rect x="48" y="50" width="12" height="12" rx="2" fill="currentColor" opacity="0.6"/>
          </svg>

          {/* Stars/Sparkles A */}
          <svg className="absolute w-24 h-24 text-ink opacity-10" viewBox="0 0 100 100" fill="currentColor" style={{ top: '34vh', left: '58vw' }}>
            <path d="M50 10 L56 34 L80 40 L56 46 L50 70 L44 46 L20 40 L44 34 Z"/>
            <circle cx="20" cy="20" r="4"/>
            <circle cx="78" cy="22" r="3"/>
          </svg>

          {/* Stars/Sparkles B */}
          <svg className="absolute w-20 h-20 text-ink opacity-10" viewBox="0 0 100 100" fill="currentColor" style={{ top: '70vh', left: '10vw' }}>
            <path d="M50 20 L54 36 L70 40 L54 44 L50 60 L46 44 L30 40 L46 36 Z"/>
            <circle cx="25" cy="55" r="3"/>
          </svg>
        </div>
        <div className="container-custom max-w-4xl mx-auto text-center relative z-10">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy bg-opacity-10 border border-burgundy rounded-full mb-8">
            <Users size={16} className="text-burgundy" />
            <span className="text-sm font-medium text-burgundy">Join 500+ indie authors growing their book business</span>
          </div>
          
          <h1 className="font-heading text-6xl lg:text-7xl font-bold text-ink mb-6 leading-tight">
            Your Book Business,
            <br />
            <span className="text-burgundy">Beautifully Organized</span>
          </h1>
          
          <p className="text-2xl text-charcoal mb-10 max-w-2xl mx-auto leading-relaxed">
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
