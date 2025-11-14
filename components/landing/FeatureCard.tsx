'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInUp } from '@/lib/animations';
import { useEffect, useState } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  stat: string;
  delay?: number;
  screenshot?: string;
}

export function FeatureCard({ icon, title, description, stat, delay = 0, screenshot }: FeatureCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="group relative bg-surface border border-stroke/50 rounded-card p-8 hover:shadow-elevated hover:border-burgundy/20 transition-all duration-300 overflow-hidden">
        <div className="w-14 h-14 bg-burgundy/10 rounded-card flex items-center justify-center mb-6 group-hover:bg-burgundy/20 transition-smooth">
          <div className="text-burgundy">{icon}</div>
        </div>
        <h3 className="font-heading text-xl font-semibold text-ink mb-3">{title}</h3>
        <p className="text-charcoal text-sm mb-4 leading-relaxed group-hover:text-ink transition-colors">{description}</p>
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 bg-glass rounded text-xs font-medium text-burgundy">
            {stat}
          </span>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full h-1 opacity-10"
          viewBox="0 0 400 10"
          preserveAspectRatio="none"
        >
          <path
            d="M0,5 Q10,0 20,5 T40,5 T60,5 T80,5 T100,5 T120,5 T140,5 T160,5 T180,5 T200,5 T220,5 T240,5 T260,5 T280,5 T300,5 T320,5 T340,5 T360,5 T380,5 T400,5"
            stroke="#8A1B2E"
            fill="none"
            strokeWidth="1"
          />
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      transition={{
        delay: delay * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className="group relative bg-surface border border-stroke/50 rounded-card p-8 hover:shadow-elevated hover:border-burgundy/20 transition-all duration-300 overflow-hidden"
      whileHover={{ y: -6, scale: 1.015 }}
    >
      {/* Ink blot hover effect */}
      <motion.div
        className="absolute inset-0 bg-burgundy opacity-0 rounded-card"
        whileHover={{ opacity: 0.02 }}
        transition={{ duration: 0.3 }}
      />

      {/* Screenshot preview on hover */}
      {screenshot && (
        <motion.div
          className="absolute inset-0 rounded-card overflow-hidden opacity-0 flex items-center justify-center bg-gradient-to-br from-burgundy/5 to-ink/5"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-32 h-20 bg-surface border border-stroke/50 rounded-sm flex items-center justify-center text-xs text-charcoal font-mono">
            {screenshot}
          </div>
        </motion.div>
      )}

      <div className="relative z-10">
        {/* Icon container with tilt effect */}
        <motion.div
          className="w-14 h-14 bg-burgundy/10 rounded-card flex items-center justify-center mb-6 group-hover:bg-burgundy/20 transition-smooth"
          whileHover={{ rotateX: 8, rotateY: 8, scale: 1.05 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
            duration: 0.3
          }}
        >
          <div className="text-burgundy">{icon}</div>
        </motion.div>

        {/* Content */}
        <h3 className="font-heading text-xl font-semibold text-ink mb-3">{title}</h3>
        <p className="text-charcoal text-sm mb-4 leading-relaxed group-hover:text-ink transition-colors">{description}</p>

        {/* Stat badge with underline animation */}
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 bg-glass rounded text-xs font-medium text-burgundy">
            {stat}
          </span>
          {!screenshot && (
            <motion.div
              className="h-0.5 bg-burgundy"
              initial={{ width: 0 }}
              whileHover={{ width: 20 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 10,
                duration: 0.3
              }}
            />
          )}
        </div>
      </div>

      {/* Torn paper effect border */}
      <svg
        className="absolute bottom-0 left-0 w-full h-1 opacity-10"
        viewBox="0 0 400 10"
        preserveAspectRatio="none"
      >
        <path
          d="M0,5 Q10,0 20,5 T40,5 T60,5 T80,5 T100,5 T120,5 T140,5 T160,5 T180,5 T200,5 T220,5 T240,5 T260,5 T280,5 T300,5 T320,5 T340,5 T360,5 T380,5 T400,5"
          stroke="#8A1B2E"
          fill="none"
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
}