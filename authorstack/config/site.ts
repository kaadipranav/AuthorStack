/**
 * Site Configuration
 * 
 * Site metadata and SEO configuration.
 */

export const siteConfig = {
  name: 'AuthorStack',
  description: 'The all-in-one platform for indie authors to track sales, manage launches, and grow their publishing business.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // SEO
  keywords: [
    'indie author',
    'self-publishing',
    'book sales',
    'author platform',
    'kdp',
    'gumroad',
    'apple books',
    'publishing analytics',
    'book marketing',
  ],
  
  // Social
  twitter: '@authorstack',
  github: 'https://github.com/authorstack',
  
  // Navigation
  mainNav: [
    {
      title: 'Features',
      href: '/#features',
    },
    {
      title: 'Pricing',
      href: '/pricing',
    },
    {
      title: 'Blog',
      href: '/blog',
    },
  ],
  
  // Dashboard navigation
  dashboardNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
    },
    {
      title: 'Books',
      href: '/books',
      icon: 'BookOpen',
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: 'BarChart3',
    },
    {
      title: 'Insights',
      href: '/insights',
      icon: 'Lightbulb',
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: 'Settings',
    },
  ],
  
  // Footer links
  footerLinks: {
    product: [
      { title: 'Features', href: '/#features' },
      { title: 'Pricing', href: '/pricing' },
      { title: 'Roadmap', href: '/roadmap' },
    ],
    company: [
      { title: 'About', href: '/about' },
      { title: 'Blog', href: '/blog' },
      { title: 'Contact', href: '/contact' },
    ],
    legal: [
      { title: 'Privacy', href: '/privacy' },
      { title: 'Terms', href: '/terms' },
    ],
  },
} as const

export type SiteConfig = typeof siteConfig
