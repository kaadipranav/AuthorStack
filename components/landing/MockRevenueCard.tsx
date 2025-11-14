'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export function MockRevenueCard() {
  const [isClient, setIsClient] = useState(false);
  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [displayUsers, setDisplayUsers] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animate revenue counter
  useEffect(() => {
    if (!isClient) return;
    let current = 0;
    const target = 2847.50;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayRevenue(target);
        clearInterval(timer);
      } else {
        setDisplayRevenue(current);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isClient]);

  // Animate user counter
  useEffect(() => {
    if (!isClient) return;
    let current = 0;
    const target = 487;
    const increment = target / 25;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayUsers(target);
        clearInterval(timer);
      } else {
        setDisplayUsers(Math.floor(current));
      }
    }, 40);
    return () => clearInterval(timer);
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="bg-surface border border-stroke/50 rounded-card p-8 max-w-md mx-auto">
        <div className="h-6 bg-glass rounded w-32 mb-4" />
        <div className="h-12 bg-glass rounded w-48 mb-6" />
        <div className="h-4 bg-glass rounded w-full" />
      </div>
    );
  }

  const delta = 12.5;
  const isPositive = delta >= 0;

  return (
    <motion.div
      className="bg-surface border border-stroke/50 rounded-card p-8 max-w-md mx-auto shadow-elevated relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {/* FOMO badge */}
      <motion.div
        className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-forest/10 rounded text-xs font-semibold text-forest"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap size={12} />
        <span>Live now</span>
      </motion.div>

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
          ${displayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </motion.div>
        <p className="text-charcoal text-xs mt-1">Last 30 days • Real-time data</p>
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
      <div className="space-y-2 text-xs mb-6">
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

      {/* Social proof FOMO */}
      <motion.div
        className="pt-4 border-t border-stroke/30 flex items-center gap-2 text-xs text-charcoal"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <Users size={14} className="text-burgundy" />
        <span>
          <span className="font-semibold text-ink">{displayUsers}+</span> authors tracking today
        </span>
      </motion.div>
    </motion.div>
  );
}
