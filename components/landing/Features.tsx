'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, Rocket, Zap } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { SectionDivider } from './SectionDivider';
import { staggerContainer } from '@/lib/animations';

const features = [
  {
    icon: <TrendingUp size={24} />,
    title: 'Unified Dashboard',
    description: 'See all your sales from Amazon KDP, Gumroad, Apple Books, and more in one elegant view',
    stat: '10+ platforms',
  },
  {
    icon: <Target size={24} />,
    title: 'Competitor Tracking',
    description: 'Monitor competitor prices and rankings. Get instant alerts when they make changes',
    stat: 'Real-time alerts',
  },
  {
    icon: <Rocket size={24} />,
    title: 'Launch Checklists',
    description: 'Pre-built 30/60/90 day templates ensure you never miss a critical launch task',
    stat: '50+ tasks',
  },
  {
    icon: <Zap size={24} />,
    title: 'A/B Testing',
    description: 'Test different covers, titles, and descriptions to find what sells best',
    stat: 'Boost sales 30%',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 bg-paper paper-texture overflow-hidden">
      <SectionDivider variant="wave" className="absolute top-0 left-0" />

      <div className="container-custom">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-ink mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">
            Built by authors, for authors. Every feature designed to save you time and grow your revenue.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="relative">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} delay={idx} />
            ))}
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-burgundy/5 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 0.8, 0.7],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div 
            className="absolute -top-10 -right-10 w-48 h-48 bg-ink/5 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
          />
        </div>
      </div>

      <SectionDivider variant="wave" className="absolute bottom-0 left-0 rotate-180" />
    </section>
  );
}
