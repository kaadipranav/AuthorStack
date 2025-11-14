import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-medium rounded-card transition-smooth duration-normal focus:outline-none focus:ring-3 focus:ring-burgundy focus:ring-offset-2 inline-flex items-center justify-center gap-2 active:scale-95';

  const variants = {
    primary: 'bg-burgundy text-white hover:bg-opacity-90 active:bg-opacity-80',
    secondary: 'border border-stroke text-ink hover:bg-glass active:bg-opacity-50',
    ghost: 'text-ink hover:underline active:text-burgundy',
    danger: 'bg-danger text-white hover:bg-opacity-90 active:bg-opacity-80',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-base h-11',
    lg: 'px-6 py-3 text-lg h-12',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className, {
        'opacity-50 cursor-not-allowed': disabled || isLoading,
      })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
