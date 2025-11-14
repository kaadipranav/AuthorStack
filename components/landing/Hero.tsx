'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/Button';
import { CoverCarousel } from './CoverCarousel';
import { MockRevenueCard } from './MockRevenueCard';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useEffect, useState } from 'react';

export function Hero() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <section className="relative min-h-screen bg-paper paper-texture overflow-hidden pt-32 pb-20">
        <div className="container-custom max-w-4xl mx-auto relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy bg-opacity-10 border border-burgundy rounded-full mb-8">
              <span className="w-2 h-2 bg-burgundy rounded-full"></span>
              <span className="text-sm font-medium text-burgundy">Join 500+ indie authors</span>
            </div>

            {/* Main heading */}
            <h1 className="font-heading text-6xl lg:text-7xl font-bold text-ink mb-6 leading-tight">
              Turn your author journey into a{' '}
              <span className="text-burgundy">well-oiled publishing engine.</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl lg:text-2xl text-charcoal mb-12 max-w-2xl mx-auto leading-relaxed">
              Bring your drafts, sales, and launches together — beautifully organized for indie authors.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <div>
                <Button variant="primary" size="lg">
                  Start Free Trial
                  <ArrowRight size={20} />
                </Button>
              </div>
              <div>
                <Button variant="secondary" size="lg">
                  <BarChart3 size={20} />
                  View Live Demo
                </Button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-charcoal">
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
            </div>
          </div>

          {/* Hero illustration - Desk to Dashboard morphing concept */}
          <div className="mt-32 lg:mt-40 relative h-[32rem] lg:h-[38rem] bg-gradient-to-br from-burgundy/5 to-ink/5 rounded-lg border border-stroke overflow-hidden">
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Illustration Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-paper via-paper to-paper/98 paper-texture overflow-hidden pt-32 pb-20">
      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/5" />
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.05) 100%)'
      }} />

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating pages */}
        <motion.div
          className="absolute w-32 h-40 bg-surface/60 border border-burgundy/70 rounded-sm shadow-sm"
          style={{ top: '15%', right: '10%' }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 2, -2, 0],
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {/* subtle page lines */}
          <div className="absolute inset-2 flex flex-col justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="block h-px w-full bg-burgundy/40 last:hidden"
                style={{ opacity: (i + 1) % 2 === 0 ? 0.25 : 0.4 }}
              />
            ))}
          </div>
        </motion.div>
        <motion.div
          className="absolute w-24 h-32 bg-surface/50 border border-burgundy/60 rounded-sm shadow-sm"
          style={{ top: '60%', left: '5%' }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, -1, 1, 0],
            transition: {
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            },
          }}
        >
          {/* subtle page lines */}
          <div className="absolute inset-2 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="block h-px w-full bg-burgundy/30 last:hidden"
                style={{ opacity: (i + 1) % 2 === 0 ? 0.2 : 0.35 }}
              />
            ))}
          </div>
        </motion.div>
        
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

          {/* Live Revenue Preview */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 mb-12"
          >
            <p className="text-charcoal text-sm font-medium mb-6">See what your dashboard looks like:</p>
            <MockRevenueCard />
          </motion.div>

          {/* Featured Books Carousel */}
          <motion.div
            variants={fadeInUp}
            className="mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-center text-charcoal text-sm font-medium mb-8">Trusted by authors like:</p>
            <CoverCarousel />
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
      </div>

      {/* Hero illustration - Desk to Dashboard morphing concept */}
      <div className="container-custom max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={fadeInUp}
          className="mt-20 lg:mt-32 relative h-[32rem] lg:h-[38rem] bg-gradient-to-br from-burgundy/5 to-ink/5 rounded-lg border border-stroke overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
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
              {/* Grid lines */}
              <line x1="450" y1="150" x2="750" y2="150" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              <line x1="450" y1="200" x2="750" y2="200" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              <line x1="450" y1="250" x2="750" y2="250" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              <line x1="550" y1="100" x2="550" y2="350" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              <line x1="650" y1="100" x2="650" y2="350" stroke="#8A1B2E" strokeWidth="1" opacity="0.5" />
              {/* Area fill under chart */}
              <polygon points="480 125, 510 135, 540 128, 540 350, 480 350" fill="#8A1B2E" opacity="0.08" />
              {/* Enhanced trend line with gradient effect */}
              <polyline points="480 125, 510 135, 540 128" fill="none" stroke="#8A1B2E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Data point circles with glow */}
              <circle cx="480" cy="125" r="4" fill="#8A1B2E" opacity="0.3" />
              <circle cx="510" cy="135" r="4" fill="#8A1B2E" opacity="0.3" />
              <circle cx="540" cy="128" r="4" fill="#8A1B2E" opacity="0.3" />
              <circle cx="480" cy="125" r="2.5" fill="#8A1B2E" />
              <circle cx="510" cy="135" r="2.5" fill="#8A1B2E" />
              <circle cx="540" cy="128" r="2.5" fill="#8A1B2E" />
              {/* Upward trend indicator */}
              <text x="560" y="115" fontSize="12" fill="#8A1B2E" fontWeight="bold" opacity="0.8">↑ 12%</text>
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
              <radialGradient id="vignetteGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
              </radialGradient>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8A1B2E" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8A1B2E" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}