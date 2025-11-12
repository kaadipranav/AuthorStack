import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/Button';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { FinalCTA } from '@/components/landing/FinalCTA';

export const metadata = {
  title: 'AuthorStack - Your Book Business Dashboard',
  description: 'Turn your author journey into a well-oiled publishing engine. Unified dashboard for indie authors.',
};

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

      {/* Main content */}
      <main>
        <Hero />
        <Features />
        <Pricing />
        <FinalCTA />
      </main>

      {/* Footer */}
      <footer className="bg-ink text-charcoal py-12 border-t border-stroke">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-burgundy" />
                <span className="font-heading text-lg font-bold text-white">AuthorStack</span>
              </div>
              <p className="text-sm leading-relaxed">
                The all-in-one dashboard for indie authors to manage, track, and grow their book business.
              </p>
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
                  <a href="#" className="hover:text-white transition-smooth">
                    Security
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
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-smooth">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stroke pt-8 text-center text-sm">
            <p>&copy; 2024 AuthorStack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
