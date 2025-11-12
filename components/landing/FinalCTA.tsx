'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function FinalCTA() {
  return (
    <section className="relative bg-burgundy text-white py-24 overflow-hidden">
      {/* Animated background pages */}
      <div className="absolute inset-0 pointer-events-none">
        {motion.div && (
          <>
            <motion.div
              className="absolute w-32 h-40 border-2 border-white opacity-5 rounded-sm"
              style={{ top: '10%', left: '5%' }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute w-28 h-36 border-2 border-white opacity-3 rounded-sm"
              style={{ bottom: '15%', right: '8%' }}
              animate={{
                y: [0, 15, 0],
                rotate: [0, -2, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
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
          {/* Heading */}
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Ready to Grow Your Book Business?
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed"
          >
            Join hundreds of indie authors who are using AuthorStack to manage their sales, track competitors, and launch with confidence.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <Link href="/auth/signup">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-burgundy hover:bg-opacity-90 group"
              >
                Start Free Today
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-smooth" />
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
