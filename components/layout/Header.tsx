import { getCurrentUser, getUserProfile } from '@/lib/auth';
import Link from 'next/link';
import { BookOpen, Settings } from 'lucide-react';
import { LogoutButton } from '@/components/auth/LogoutButton';

export async function Header() {
  const user = await getCurrentUser();
  const profile = await getUserProfile();

  if (!user) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">AuthorStack</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center mb-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">AuthorStack</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{user.email}</span>
            {profile && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                {profile.subscription_tier}
              </span>
            )}
            <LogoutButton />
          </div>
        </div>

        <nav className="flex flex-wrap gap-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-primary transition">
            Dashboard
          </Link>
          <Link href="/launches" className="text-gray-600 hover:text-primary transition">
            Launches
          </Link>
          <Link href="/competitors" className="text-gray-600 hover:text-primary transition">
            Competitors
          </Link>

          {profile?.subscription_tier !== 'free' && (
            <>
              <Link href="/ab-tests" className="text-gray-600 hover:text-primary transition">
                A/B Tests
              </Link>
              <Link href="/calendar" className="text-gray-600 hover:text-primary transition">
                Calendar
              </Link>
            </>
          )}

          <Link href="/settings" className="text-gray-600 hover:text-primary transition ml-auto">
            <Settings className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
