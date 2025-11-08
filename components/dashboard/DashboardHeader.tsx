import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { BookOpen } from 'lucide-react';

export async function DashboardHeader() {
  const user = await getCurrentUser();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container-custom py-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">AuthorStack</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            Profile
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <LogoutButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
