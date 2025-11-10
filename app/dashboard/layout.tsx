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
  const user = await getCurrentUser();
  const profile = await getUserProfile();

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
          user={user ? { email: user.email || '', name: profile?.full_name } : undefined}
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
