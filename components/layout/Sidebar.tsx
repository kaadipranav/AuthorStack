'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Rocket,
  Users,
  FlaskConical,
  Calendar,
  TrendingUp,
  Plug,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  requiresPro?: boolean;
}

interface SidebarProps {
  subscriptionTier?: string;
}

export function Sidebar({ subscriptionTier = 'free' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Books', href: '/books', icon: <BookOpen size={20} /> },
    { label: 'Launches', href: '/launches', icon: <Rocket size={20} /> },
    { label: 'Competitors', href: '/competitors', icon: <Users size={20} /> },
    { label: 'A/B Tests', href: '/ab-tests', icon: <FlaskConical size={20} />, requiresPro: true },
    { label: 'Calendar', href: '/calendar', icon: <Calendar size={20} />, requiresPro: true },
    { label: 'Insights', href: '/insights', icon: <TrendingUp size={20} /> },
    { label: 'Integrations', href: '/platforms', icon: <Plug size={20} /> },
    { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
    { label: 'Billing', href: '/pricing', icon: <CreditCard size={20} /> },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const canAccess = (item: NavItem) => {
    if (!item.requiresPro) return true;
    return subscriptionTier !== 'free';
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-surface border-r border-stroke transition-all duration-normal z-50',
        isCollapsed ? 'w-14' : 'w-60'
      )}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-surface border border-stroke rounded-full flex items-center justify-center hover:bg-glass transition-smooth"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-stroke">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-smooth">
          <Image
            src="/logo.png"
            alt="AuthorStack"
            width={isCollapsed ? 28 : 32}
            height={isCollapsed ? 28 : 32}
            className="transition-all"
          />
          {!isCollapsed && (
            <span className="font-heading text-sm font-bold text-ink">AuthorStack</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const accessible = canAccess(item);
          
          return (
            <Link
              key={item.href}
              href={accessible ? item.href : '/pricing?upgrade=pro'}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-card transition-smooth duration-fast relative group',
                active && 'bg-glass',
                !accessible && 'opacity-50',
                isCollapsed ? 'justify-center' : ''
              )}
              aria-current={active ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-burgundy rounded-r" />
              )}
              
              <span className={cn('text-charcoal group-hover:text-ink', active && 'text-ink')}>
                {item.icon}
              </span>
              
              {!isCollapsed && (
                <>
                  <span className={cn('text-sm font-medium text-charcoal group-hover:text-ink', active && 'text-ink')}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-auto bg-burgundy text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {!accessible && (
                    <span className="ml-auto text-xs text-amber font-medium">Pro</span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Keyboard Shortcuts Hint */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-glass rounded-card border border-stroke">
          <p className="text-xs text-charcoal mb-2 font-medium">Keyboard Shortcuts</p>
          <div className="space-y-1 text-xs text-charcoal">
            <div className="flex justify-between">
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 bg-surface border border-stroke rounded font-mono text-xs">⌘K</kbd>
            </div>
            <div className="flex justify-between">
              <span>Dashboard</span>
              <kbd className="px-1.5 py-0.5 bg-surface border border-stroke rounded font-mono text-xs">⌘1</kbd>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
