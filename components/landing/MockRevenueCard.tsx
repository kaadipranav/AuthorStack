'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export function MockRevenueCard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-surface border border-stroke/50 rounded-card p-8 max-w-md mx-auto">
        <div className="h-6 bg-glass rounded w-32 mb-4" />
        <div className="h-12 bg-glass rounded w-48 mb-6" />
        <div className="h-4 bg-glass rounded w-full" />
      </div>
    );
  }

  const revenue = 2847.50;
  const delta = 12.5;
  const isPositive = delta >= 0;

  return (
    <motion.div
      className="bg-surface border border-stroke/50 rounded-card p-8 max-w-md mx-auto shadow-elevated"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-charcoal text-sm font-semibold">Total Revenue</h3>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-forest' : 'text-danger'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(delta)}%</span>
        </div>
      </div>

      <div className="mb-6">
        <motion.div
          className="font-mono text-4xl font-semibold text-ink"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          ${revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </motion.div>
        <p className="text-charcoal text-xs mt-1">Last 30 days</p>
      </div>

      {/* Mini sparkline chart */}
      <div className="flex items-end gap-1 h-12 mb-4">
        {[45, 52, 38, 65, 48, 72, 55, 68, 42, 78].map((height, idx) => (
          <motion.div
            key={idx}
            className="flex-1 bg-burgundy/20 rounded-t-sm"
            style={{ height: `${height}%` }}
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            transition={{ duration: 0.6, delay: 0.4 + idx * 0.05 }}
            viewport={{ once: true }}
          />
        ))}
      </div>

      {/* Platform breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-charcoal">Amazon KDP</span>
          <span className="font-mono font-semibold text-ink">$1,420</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-charcoal">Gumroad</span>
          <span className="font-mono font-semibold text-ink">$892</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-charcoal">Apple Books</span>
          <span className="font-mono font-semibold text-ink">$535</span>
        </div>
      </div>
    </motion.div>
  );
}
