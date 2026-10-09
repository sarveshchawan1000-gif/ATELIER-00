'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { ArrowDown, ArrowRight } from 'lucide-react';

export const HERO_CLOTHING_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&auto=format&fit=crop&q=85',
    title: 'Oversized Boxy Silhouette',
    category: 'Drop 01',
  },
  {
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1920&auto=format&fit=crop&q=85',
    title: '450 GSM Heavy French Terry Hoodie',
    category: 'Heavy Hoodies',
  },
  {
    url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1920&auto=format&fit=crop&q=85',
    title: 'Monolithic Technical Outerwear',
    category: 'Outerwear',
  },
  {
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1920&auto=format&fit=crop&q=85',
    title: 'Acid Washed Structural Cotton Tee',
    category: 'Oversized Tees',
  },
  {
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&auto=format&fit=crop&q=85',
    title: 'Relaxed Wide-Leg Pleated Trousers',
    category: 'Tailored Bottoms',
  },
];

// Speed configured to 4.0 seconds per photo (satisfies: not less than 3 sec)
const IMAGE_DURATION = 4000;

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
  const [activeIndex, setActiveIndex] = useState(0);

  // Infinite loop of background clothing photos (stays 4s per image >= 3s)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_CLOTHING_IMAGES.length);
    }, IMAGE_DURATION);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden bg-cream pt-20 pb-8 px-4 md:px-8 select-none"
      aria-label="ZIPUP NATION Hero"
    >
      {/* Background Campaign Photos (Infinite Crossfade Loop) */}
      <div
        ref={heroImageRef}
        className="absolute inset-0 z-0 will-change-transform"
      >
        {HERO_CLOTHING_IMAGES.map((img, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div
              key={img.url}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center brightness-[0.82] transition-transform duration-[6000ms] ease-out will-change-transform"
                style={{
                  transform: isActive ? 'scale(1.04)' : 'scale(1.0)',
                }}
              />
            </div>
          );
        })}

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-cream/80 via-black/15 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-black/20 pointer-events-none" />
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
          <p className="font-body text-xs sm:text-sm md:text-base font-medium tracking-[0.15em] text-white/80 uppercase">
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

      {/* Bottom Indicators & Clothing Photo Loop Tracker */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between font-body text-[11px] font-medium tracking-wider uppercase text-white/60">
        {/* Photo Pagination & Category */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-label="Photo carousel indicators">
            {HERO_CLOTHING_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Jump to look ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                  activeIndex === i
                    ? 'w-7 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <span className="font-mono text-white/80">
            0{activeIndex + 1} / 0{HERO_CLOTHING_IMAGES.length}
          </span>
          <span className="hidden sm:inline-block text-white/40">·</span>
          <span className="hidden sm:inline-block text-white/70">
            {HERO_CLOTHING_IMAGES[activeIndex].category}
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="flex items-center gap-2 animate-bounce">
          <span>Scroll</span>
          <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
