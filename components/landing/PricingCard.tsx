'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/Button';
import { fadeInUp } from '@/lib/animations';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  badge?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  delay?: number;
}

export function PricingCard({
  name,
  price,
  period,
  badge,
  features,
  cta,
  highlighted = false,
  delay = 0,
}: PricingCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ delay: delay * 0.1 }}
      className={`relative bg-surface border rounded-card p-8 transition-all duration-300 ${
        highlighted
          ? 'border-burgundy shadow-elevated lg:scale-105'
          : 'border-stroke hover:shadow-elevated'
      }`}
      whileHover={{ y: -8 }}
    >
      {/* Ribbon badge */}
      {badge && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-burgundy text-white text-xs font-semibold rounded-full shadow-elevated"
          initial={{ scale: 0, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {badge}
        </motion.div>
      )}

      {/* Background accent */}
      <motion.div
        className={`absolute inset-0 rounded-card opacity-0 ${
          highlighted ? 'bg-burgundy' : 'bg-ink'
        }`}
        whileHover={{ opacity: 0.02 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">
        {/* Plan name */}
        <h3 className="font-heading text-2xl font-bold text-ink mb-4">{name}</h3>

        {/* Price */}
        <div className="mb-8">
          <span className="font-mono text-5xl font-bold text-ink">{price}</span>
          {period && <span className="text-charcoal ml-2">{period}</span>}
        </div>

        {/* Features list */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <motion.li
              key={idx}
              className="flex items-start gap-3 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <Check size={16} className="text-forest flex-shrink-0 mt-0.5" />
              <span className="text-charcoal">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link href="/auth/signup" className="block">
          <Button
            variant={highlighted ? 'primary' : 'secondary'}
            className="w-full"
          >
            {cta}
          </Button>
        </Link>
      </div>

      {/* Decorative corner mark */}
      <svg
        className="absolute top-4 right-4 w-8 h-8 opacity-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 3h18v18H3z" />
        <path d="M6 6h12v12H6z" />
      </svg>
    </motion.div>
  );
}
