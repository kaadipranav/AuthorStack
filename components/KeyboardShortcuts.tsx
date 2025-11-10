'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + 1: Dashboard
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        router.push('/dashboard');
      }

      // Cmd/Ctrl + 2: Books
      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        router.push('/books');
      }

      // Cmd/Ctrl + 3: Launches
      if ((e.metaKey || e.ctrlKey) && e.key === '3') {
        e.preventDefault();
        router.push('/launches');
      }

      // Cmd/Ctrl + N: New Book
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        router.push('/books/new');
      }

      // / : Focus search (handled in Topbar)
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null;
}
