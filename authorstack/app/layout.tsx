import type { Metadata } from 'next'
import { Inter, Merriweather, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AuthorStack - Indie Author SaaS Platform',
    template: '%s | AuthorStack',
  },
  description: 'The all-in-one platform for indie authors to track sales, manage launches, and grow their publishing business.',
  keywords: ['indie author', 'self-publishing', 'book sales', 'author platform', 'kdp', 'gumroad'],
  authors: [{ name: 'AuthorStack' }],
  creator: 'AuthorStack',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'AuthorStack - Indie Author SaaS Platform',
    description: 'The all-in-one platform for indie authors to track sales, manage launches, and grow their publishing business.',
    siteName: 'AuthorStack',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuthorStack - Indie Author SaaS Platform',
    description: 'The all-in-one platform for indie authors to track sales, manage launches, and grow their publishing business.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable} font-body antialiased bg-paper text-ink`}>
        {children}
      </body>
    </html>
  )
}
