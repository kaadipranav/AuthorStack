'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useEffect, useState } from 'react';

export function FinalCTA() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <section className="relative bg-burgundy text-white py-24 overflow-hidden">
        <div className="container-custom max-w-3xl mx-auto text-center relative z-10">
          {/* Heading */}
          <h2 className="font-heading text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready to Grow Your Book Business?
          </h2>

          {/* Subheading */}
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Join hundreds of indie authors who are using AuthorStack to manage their sales, track competitors, and launch with confidence.
          </p>

          {/* CTA Button */}
          <div>
            <Link href="/auth/signup">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-burgundy hover:bg-opacity-90"
              >
                Start Free Today
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-sm opacity-75 mt-8">
            No credit card required. 14-day free trial. Cancel anytime.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-burgundy text-white py-24 overflow-hidden">
      {/* Animated background pages */}
      <div className="absolute inset-0 pointer-events-none">
        {motion.div && (
          <>
            <motion.div
              className="absolute w-32 h-40 border border-white/60 bg-white/10 rounded-sm backdrop-blur-sm"
              style={{ top: '10%', left: '5%' }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 1, -1, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute w-28 h-36 border border-white/50 bg-white/5 rounded-sm backdrop-blur-sm"
              style={{ bottom: '15%', right: '8%' }}
              animate={{
                y: [0, 12, 0],
                rotate: [0, -1, 1, 0],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
            />
          </>
        )}
      </div>

      <div className="container-custom max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Urgency badge */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-2 mb-6 text-sm font-semibold"
          >
            <Clock size={16} />
            <span>Limited spots available in beta</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Ready to Grow Your Book Business?
          </motion.h2>

          {/* Subheading with FOMO */}
          <motion.p
            variants={fadeInUp}
            className="text-xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed"
          >
            Join <span className="font-bold">487+ indie authors</span> who are already using AuthorStack to manage their sales, track competitors, and launch with confidence.
          </motion.p>

          {/* Social proof */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-4 mb-8 text-sm opacity-80"
          >
            <div className="flex items-center gap-1">
              <span className="text-lg">⭐</span>
              <span>4.9/5 from beta users</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-1">
              <span className="text-lg">🚀</span>
              <span>30% avg revenue boost</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <Link href="/auth/signup">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-burgundy hover:bg-opacity-90 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Today
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight size={20} />
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </Button>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            variants={fadeInUp}
            className="text-sm opacity-75 mt-8"
          >
            No credit card required. 14-day free trial. Cancel anytime.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}