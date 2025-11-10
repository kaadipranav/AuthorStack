import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@/components/Analytics';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'AuthorStack - Book Business Dashboard',
  description: 'All-in-one SaaS dashboard for indie authors to manage their book business',
  keywords: ['books', 'sales', 'dashboard', 'indie authors', 'KDP'],
  authors: [{ name: 'AuthorStack' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://authorstack.com',
    title: 'AuthorStack',
    description: 'Manage your book business in one place',
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
