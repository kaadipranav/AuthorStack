'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, RefreshCw, Bell, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';

interface TopbarProps {
  user?: {
    email?: string;
    name?: string;
  };
  subscriptionTier?: string;
  lastSyncTime?: Date;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function Topbar({ user, subscriptionTier, lastSyncTime, onSync, isSyncing }: TopbarProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Keyboard shortcut for search (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-surface border-b border-stroke backdrop-blur-sm bg-opacity-95">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left: Search */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 px-4 py-2 bg-paper border border-stroke rounded-card text-charcoal hover:border-burgundy transition-smooth group"
          >
            <Search size={16} className="text-charcoal group-hover:text-burgundy" />
            <span className="text-sm">Search AuthorStack...</span>
            <kbd className="ml-auto px-2 py-0.5 bg-surface border border-stroke rounded text-xs font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Center: Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/books/new')}
            className="hidden sm:flex"
          >
            <Plus size={16} />
            New Book
          </Button>

          <button
            onClick={onSync}
            disabled={isSyncing}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-card border border-stroke hover:bg-glass transition-smooth',
              isSyncing && 'opacity-50 cursor-not-allowed'
            )}
            title={`Last synced: ${formatLastSync(lastSyncTime)}`}
          >
            <RefreshCw size={16} className={cn('text-charcoal', isSyncing && 'animate-spin')} />
            <span className="text-sm text-charcoal hidden md:inline">
              {isSyncing ? 'Syncing...' : 'Sync'}
            </span>
          </button>
        </div>

        {/* Right: Notifications & User */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-card hover:bg-glass transition-smooth"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-charcoal" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-burgundy rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-card hover:bg-glass transition-smooth"
            >
              <div className="w-8 h-8 bg-burgundy rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              {user?.email && (
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-ink">{user.name || 'Author'}</p>
                  <p className="text-xs text-charcoal capitalize">{subscriptionTier || 'Free'}</p>
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-stroke rounded-card shadow-elevated z-50">
                  <div className="p-3 border-b border-stroke">
                    <p className="text-sm font-medium text-ink">{user?.email}</p>
                    <p className="text-xs text-charcoal mt-1 capitalize">
                      {subscriptionTier || 'Free'} Plan
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        router.push('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-glass rounded-card transition-smooth"
                    >
                      <SettingsIcon size={16} />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        router.push('/api/auth/signout');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-glass rounded-card transition-smooth"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-ink bg-opacity-20 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div
            className="absolute inset-0"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
          />
          <div className="relative w-full max-w-2xl bg-surface rounded-modal shadow-elevated border border-stroke">
            <div className="flex items-center gap-3 p-4 border-b border-stroke">
              <Search size={20} className="text-charcoal" />
              <input
                type="text"
                placeholder="Search books, launches, competitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-ink placeholder-charcoal"
                autoFocus
              />
              <kbd className="px-2 py-1 bg-glass border border-stroke rounded text-xs font-mono">
                ESC
              </kbd>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <p className="text-sm text-charcoal text-center py-8">
                {searchQuery ? 'No results found' : 'Start typing to search...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
