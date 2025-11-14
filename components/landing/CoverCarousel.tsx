'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CoverCarouselProps {
  autoScroll?: boolean;
  interval?: number;
}

const mockCovers = [
  { id: 1, title: 'Silver Thorns', author: 'Emma Rose', color: 'from-purple-900 to-pink-600' },
  { id: 2, title: 'Letters to P', author: 'James Wright', color: 'from-blue-900 to-cyan-600' },
  { id: 3, title: 'The Last Echo', author: 'Sarah Chen', color: 'from-amber-900 to-orange-600' },
  { id: 4, title: 'Midnight Garden', author: 'Alex Morgan', color: 'from-emerald-900 to-teal-600' },
  { id: 5, title: 'Whispered Secrets', author: 'Nina Patel', color: 'from-rose-900 to-red-600' },
  { id: 6, title: 'Echoes of Tomorrow', author: 'Marcus Lee', color: 'from-indigo-900 to-purple-600' },
];

export function CoverCarousel({ autoScroll = true, interval = 4000 }: CoverCarouselProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!autoScroll || !isClient || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockCovers.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoScroll, interval, isHovered, isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-48 bg-glass rounded-card flex items-center justify-center">
        <span className="text-charcoal text-sm">Loading covers...</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + mockCovers.length) % mockCovers.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockCovers.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel container */}
      <div className="flex gap-4 pb-4">
        {mockCovers.map((cover, idx) => {
          const isActive = idx === currentIndex;
          const offset = (idx - currentIndex + mockCovers.length) % mockCovers.length;

          return (
            <motion.div
              key={cover.id}
              className="flex-shrink-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: isActive ? 1 : offset === 1 ? 0.6 : 0,
                x: offset === 0 ? 0 : offset === 1 ? 200 : 400,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <motion.div
                className={`w-40 h-56 rounded-card bg-gradient-to-br ${cover.color} shadow-elevated border border-stroke/20 flex flex-col items-center justify-center p-6 cursor-pointer`}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <div className="text-center">
                  <h3 className="font-heading text-white text-lg font-semibold mb-2 line-clamp-2">
                    {cover.title}
                  </h3>
                  <p className="text-white/80 text-sm">{cover.author}</p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <motion.button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-2 rounded-full bg-burgundy/10 hover:bg-burgundy/20 text-burgundy transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={20} />
      </motion.button>

      <motion.button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-2 rounded-full bg-burgundy/10 hover:bg-burgundy/20 text-burgundy transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight size={20} />
      </motion.button>

      {/* Indicator dots */}
      <div className="flex justify-center gap-2 mt-6">
        {mockCovers.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-burgundy w-6' : 'bg-stroke w-2'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
}
