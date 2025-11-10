import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { getCurrentUser, getUserProfile } from '@/lib/auth';

export const metadata = {
  title: 'Dashboard - AuthorStack',
  description: 'Your AuthorStack dashboard',
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Get user and profile - middleware ensures user exists
  const user = await getCurrentUser();
  const profile = await getUserProfile();

  // If user doesn't exist, show loading state (middleware will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-paper paper-texture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
          <p className="text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper paper-texture">
      {/* Keyboard Shortcuts Handler */}
      <KeyboardShortcuts />
      
      {/* Sidebar - Fixed Left */}
      <Sidebar subscriptionTier={profile?.subscription_tier} />
      
      {/* Main Content Area */}
      <div className="pl-60 transition-all duration-normal">
        {/* Topbar - Sticky Top */}
        <Topbar 
          user={{ email: user.email || '', name: profile?.full_name }}
          subscriptionTier={profile?.subscription_tier}
        />
        
        {/* Main Content */}
        <main className="container-custom py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
