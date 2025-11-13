'use client';

import { motion } from 'framer-motion';
import { PricingCard } from './PricingCard';
import { SectionDivider } from './SectionDivider';
import { staggerContainer } from '@/lib/animations';
import { useEffect, useState } from 'react';

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <section className="relative py-24 bg-surface">
        <div className="container-custom">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-ink mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-charcoal">
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative bg-surface border rounded-card p-8 ${
                  plan.highlighted
                    ? 'border-burgundy/70 shadow-elevated'
                    : 'border-stroke/60'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-burgundy text-white text-xs font-semibold rounded-full shadow-elevated">
                    {plan.badge}
                  </div>
                )}
                <div className="group">
                  <h3 className="font-heading text-2xl font-bold text-ink mb-4 group-hover:text-burgundy transition-colors">
                    {plan.name}
                  </h3>
                  <div className="mb-8">
                    <span className="font-mono text-5xl font-bold text-ink">{plan.price}</span>
                    {plan.period && <span className="text-charcoal ml-2">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <span className="text-forest flex-shrink-0 mt-0.5">✓</span>
                        <span className="text-charcoal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="block">
                    <button
                      className={`w-full px-4 py-3 rounded-card font-medium ${
                        plan.highlighted 
                          ? 'bg-burgundy text-white hover:bg-opacity-90' 
                          : 'border border-stroke text-ink hover:bg-glass'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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