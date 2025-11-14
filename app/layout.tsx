import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@/components/Analytics';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'AuthorStack - Book Business Dashboard',
  description: 'All-in-one SaaS dashboard for indie authors to manage their book business',
  keywords: ['books', 'sales', 'dashboard', 'indie authors', 'KDP'],
  authors: [{ name: 'AuthorStack' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://authorstack.com',
    title: 'AuthorStack',
    description: 'Manage your book business in one place',
    images: [{
      url: '/logo.png',
      width: 512,
      height: 512,
      alt: 'AuthorStack Logo',
    }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
