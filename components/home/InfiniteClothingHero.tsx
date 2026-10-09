'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const HERO_CLOTHING_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&auto=format&fit=crop&q=85',
    title: 'Oversized Boxy Silhouette',
    category: 'Drop 01',
  },
  {
    src: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1920&auto=format&fit=crop&q=85',
    title: '450 GSM Heavy French Terry Hoodie',
    category: 'Heavy Hoodies',
  },
  {
    src: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1920&auto=format&fit=crop&q=85',
    title: 'Monolithic Technical Outerwear',
    category: 'Outerwear',
  },
  {
    src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1920&auto=format&fit=crop&q=85',
    title: 'Acid Washed Structural Cotton Tee',
    category: 'Oversized Tees',
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&auto=format&fit=crop&q=85',
    title: 'Relaxed Wide-Leg Pleated Trousers',
    category: 'Tailored Bottoms',
  },
];

// Speed configured to 4.0 seconds per photo (satisfies: not less than 3 sec)
const IMAGE_DURATION = 4000;
const TRANSITION_DURATION = 1200;

export default function InfiniteClothingHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_CLOTHING_IMAGES.length);
    }, IMAGE_DURATION);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      className="relative isolate flex min-h-[85svh] items-center overflow-hidden bg-[#111111] text-white md:min-h-screen select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Infinite Clothing Hero"
    >
      {/* BACKGROUND PHOTOS INFINITE CROSSFADE */}
      <div className="absolute inset-0 -z-20">
        {HERO_CLOTHING_IMAGES.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={item.src}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center brightness-[0.80] transition-transform duration-[6000ms] ease-out will-change-transform"
                style={{
                  transform: isActive ? 'scale(1.05)' : 'scale(1.0)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* GRADIENT OVERLAYS FOR ELEGANT CONTRAST */}
      <div className="absolute inset-0 -z-10 bg-black/45 pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

      {/* FOREGROUND CONTENT */}
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 md:px-12 flex flex-col justify-between min-h-[85svh] md:min-h-screen">
        <div className="pt-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            ZIPUP NATION / {HERO_CLOTHING_IMAGES[activeIndex].category}
          </p>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.88] tracking-[-0.065em] sm:text-7xl md:text-8xl lg:text-[9.5rem] text-white">
            Wear the
            <br />
            <span className="text-white/60">Movement.</span>
          </h1>

          <p className="mt-8 max-w-lg text-sm leading-7 text-white/80 md:text-base">
            Streetwear made for your pace. Discover the latest monograph drops from
            ZIPUP NATION.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-white px-7 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-cream rounded-sm"
            >
              Shop the drop <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/collections"
              className="border border-white/40 px-7 py-4 text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-white/10 rounded-sm"
            >
              Explore collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
