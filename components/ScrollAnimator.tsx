'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollAnimatorProps {
  children: ReactNode;
  animation?: 'fade-in-up' | 'fade-in-left' | 'fade-in-right';
  delay?: number;
  className?: string;
}

export function ScrollAnimator({
  children,
  animation = 'fade-in-up',
  delay = 0,
  className = '',
}: ScrollAnimatorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.style.animationDelay = `${delay}ms`;
              ref.current.classList.add(`scroll-${animation}`);
            }
          }, 0);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [animation, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
