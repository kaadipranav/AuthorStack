'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/Button';
import { fadeInUp, staggerContainer, floatingAnimation } from '@/lib/animations';

export function Hero() {
  return (
    <section className="relative min-h-screen bg-paper paper-texture overflow-hidden pt-32 pb-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating pages */}
        <motion.div
          className="absolute w-32 h-40 bg-surface/60 border border-burgundy/70 rounded-sm shadow-sm"
          style={{ top: '15%', right: '10%' }}
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute w-24 h-32 bg-surface/50 border border-burgundy/60 rounded-sm shadow-sm"
          style={{ top: '60%', left: '5%' }}
          animate={{ ...floatingAnimation, duration: 4 }}
        />
        
        {/* Ink blot decorations */}
        <div className="absolute w-96 h-96 bg-burgundy opacity-5 rounded-full blur-3xl" style={{ top: '-10%', right: '-5%' }} />
        <div className="absolute w-80 h-80 bg-ink opacity-3 rounded-full blur-3xl" style={{ bottom: '-5%', left: '-5%' }} />
      </div>

      <div className="container-custom max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy bg-opacity-10 border border-burgundy rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-burgundy rounded-full animate-pulse" />
            <span className="text-sm font-medium text-burgundy">Join 500+ indie authors</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={fadeInUp}
            className="font-heading text-6xl lg:text-7xl font-bold text-ink mb-6 leading-tight"
          >
            Turn your author journey into a{' '}
            <span className="text-burgundy">well-oiled publishing engine.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-xl lg:text-2xl text-charcoal mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Bring your drafts, sales, and launches together — beautifully organized for indie authors.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="group">
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-smooth" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="group">
              <BarChart3 size={20} />
              View Live Demo
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-ink"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 text-sm text-charcoal"
          >
            <div className="flex items-center gap-2">
              <span className="text-burgundy">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-burgundy">✓</span>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-burgundy">✓</span>
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero illustration - Desk to Dashboard morphing concept */}
        <motion.div
          variants={fadeInUp}
          className="mt-32 lg:mt-40 relative h-[32rem] lg:h-[38rem] bg-gradient-to-br from-burgundy/5 to-ink/5 rounded-lg border border-stroke overflow-hidden"
        >
          <svg
            viewBox="0 0 800 400"
            className="w-full h-full scale-110"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transformOrigin: 'center 60%' }}
          >
            {/* Writing desk */}
            <g opacity="0.8">
              <rect x="50" y="200" width="300" height="150" fill="none" stroke="#8A1B2E" strokeWidth="2" />
              <line x1="100" y1="200" x2="100" y2="350" stroke="#8A1B2E" strokeWidth="2" />
              <line x1="200" y1="200" x2="200" y2="350" stroke="#8A1B2E" strokeWidth="2" />
              <line x1="300" y1="200" x2="300" y2="350" stroke="#8A1B2E" strokeWidth="2" />
              {/* Papers on desk */}
              <rect x="70" y="180" width="40" height="30" fill="#FAF7F1" stroke="#8A1B2E" strokeWidth="1" />
              <rect x="120" y="175" width="40" height="30" fill="#FAF7F1" stroke="#8A1B2E" strokeWidth="1" />
              <line x1="75" y1="190" x2="105" y2="190" stroke="#3C3B39" strokeWidth="0.5" />
              <line x1="75" y1="200" x2="105" y2="200" stroke="#3C3B39" strokeWidth="0.5" />
            </g>

            {/* Dashboard grid */}
            <g opacity="0.8">
              <rect x="450" y="100" width="300" height="250" fill="none" stroke="#8A1B2E" strokeWidth="2" />
              <line x1="450" y1="150" x2="750" y2="150" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              <line x1="450" y1="200" x2="750" y2="200" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              <line x1="450" y1="250" x2="750" y2="250" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              <line x1="550" y1="100" x2="550" y2="350" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              <line x1="650" y1="100" x2="650" y2="350" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              {/* Dashboard data points */}
              <circle cx="480" cy="125" r="3" fill="#8A1B2E" />
              <circle cx="510" cy="135" r="3" fill="#8A1B2E" />
              <circle cx="540" cy="128" r="3" fill="#8A1B2E" />
            </g>

            {/* Arrow showing transformation */}
            <path
              d="M 380 250 Q 415 200 450 250"
              fill="none"
              stroke="#8A1B2E"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              opacity="0.6"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#8A1B2E" />
              </marker>
            </defs>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
