'use client';

import { motion } from 'framer-motion';
import { PricingCard } from './PricingCard';
import { SectionDivider } from './SectionDivider';
import { staggerContainer } from '@/lib/animations';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['1 Book', '1 Platform', 'Basic Dashboard', 'Launch Checklist'],
    cta: 'Start Free',
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    badge: 'Most Popular',
    features: [
      'Unlimited Books',
      'All Platforms',
      'Competitor Tracking',
      'A/B Testing',
      'Email Alerts',
      'Priority Support',
    ],
    highlighted: true,
    cta: 'Start 14-Day Trial',
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    features: [
      'Everything in Pro',
      'Custom Integrations',
      'White-label Reports',
      'API Access',
      'Dedicated Manager',
    ],
    cta: 'Contact Sales',
  },
];

export function Pricing() {
  return (
    <section className="relative py-24 bg-surface">
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-charcoal">
            Start free, upgrade as you grow. No hidden fees.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {plans.map((plan, idx) => (
            <PricingCard key={idx} {...plan} delay={idx} />
          ))}
        </motion.div>
      </div>

      <SectionDivider variant="wave" className="absolute bottom-0 left-0 rotate-180" />
    </section>
  );
}
