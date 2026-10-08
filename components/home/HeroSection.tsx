'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { ArrowDown, ArrowRight } from 'lucide-react';

export interface HeroSectionProps {
  heroImageRef?: React.RefObject<HTMLDivElement | null>;
  wordmarkLeftRef?: React.RefObject<HTMLSpanElement | null>;
  wordmarkRightRef?: React.RefObject<HTMLSpanElement | null>;
  taglineRef?: React.RefObject<HTMLDivElement | null>;
}

export function HeroSection({
  heroImageRef,
  wordmarkLeftRef,
  wordmarkRightRef,
  taglineRef,
}: HeroSectionProps) {
  return (
    <section
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden bg-cream pt-20 pb-8 px-4 md:px-8 select-none"
      aria-label="ZIPUP NATION Hero"
    >
      {/* Background Campaign Image (LCP optimized) */}
      <div
        ref={heroImageRef}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&auto=format&fit=crop&q=85"
          alt="ZIPUP NATION Streetwear Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.85]"
        />
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream/80 via-black/10 to-black/15" />
      </div>

      {/* Top Spacer */}
      <div className="relative z-10" />

      {/* Center Wordmark */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center my-auto">
        <h1
          className="font-display font-semibold tracking-tight uppercase text-white flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 md:gap-6 leading-[0.9]"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 11rem)' }}
          aria-label={`${CONFIG.brandHalves.left} ${CONFIG.brandHalves.right}`}
        >
          <span
            ref={wordmarkLeftRef}
            className="inline-block will-change-transform"
            aria-hidden="true"
          >
            {CONFIG.brandHalves.left}
          </span>
          <span
            ref={wordmarkRightRef}
            className="inline-block text-white/50 will-change-transform"
            aria-hidden="true"
          >
            {CONFIG.brandHalves.right}
          </span>
        </h1>

        {/* Tagline and CTA */}
        <div
          ref={taglineRef}
          className="mt-6 sm:mt-8 flex flex-col items-center gap-5 will-change-transform"
        >
          <p className="font-body text-xs sm:text-sm md:text-base font-medium tracking-[0.15em] text-white/70 uppercase">
            Built for the next generation.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/collections/new-arrivals">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-display font-medium tracking-wider uppercase transition-all"
              >
                Shop New Arrivals <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Indicators */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between font-body text-[11px] font-medium tracking-wider uppercase text-white/40">
        <span>Autumn / Drop 01</span>
        <div className="flex items-center gap-2 animate-bounce">
          <span>Scroll</span>
          <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
