import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'burgundy';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-glass border-stroke text-ink',
    success: 'bg-forest bg-opacity-10 border-forest text-forest',
    warning: 'bg-amber bg-opacity-10 border-amber text-amber',
    danger: 'bg-danger bg-opacity-10 border-danger text-danger',
    burgundy: 'bg-burgundy bg-opacity-10 border-burgundy text-burgundy',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-small font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
