'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { FinalCTA } from '@/components/landing/FinalCTA';

export default function ClientHome() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <>
          <Hero />
          <Features />
          <Pricing />
          <FinalCTA />
        </>
      )}
    </>
  );
}