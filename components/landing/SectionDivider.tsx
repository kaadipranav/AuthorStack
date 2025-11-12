'use client';

import { motion } from 'framer-motion';

interface SectionDividerProps {
  variant?: 'wave' | 'torn' | 'line';
  className?: string;
}

export function SectionDivider({ variant = 'wave', className = '' }: SectionDividerProps) {
  if (variant === 'wave') {
    return (
      <svg
        className={`w-full h-20 text-burgundy opacity-10 ${className}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (variant === 'torn') {
    return (
      <svg
        className={`w-full h-12 text-burgundy opacity-20 ${className}`}
        viewBox="0 0 1200 50"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,25 Q10,15 20,25 T40,25 T60,25 T80,25 T100,25 T120,25 T140,25 T160,25 T180,25 T200,25 T220,25 T240,25 T260,25 T280,25 T300,25 T320,25 T340,25 T360,25 T380,25 T400,25 T420,25 T440,25 T460,25 T480,25 T500,25 T520,25 T540,25 T560,25 T580,25 T600,25 T620,25 T640,25 T660,25 T680,25 T700,25 T720,25 T740,25 T760,25 T780,25 T800,25 T820,25 T840,25 T860,25 T880,25 T900,25 T920,25 T940,25 T960,25 T980,25 T1000,25 T1020,25 T1040,25 T1060,25 T1080,25 T1100,25 T1120,25 T1140,25 T1160,25 T1180,25 T1200,25"
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <motion.div
      className={`h-px bg-gradient-to-r from-transparent via-burgundy to-transparent opacity-20 ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    />
  );
}
