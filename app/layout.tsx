import type { Metadata } from 'next';
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
