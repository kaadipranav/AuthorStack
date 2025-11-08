import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Dashboard - AuthorStack',
  description: 'Your AuthorStack dashboard',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container-custom py-8 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
