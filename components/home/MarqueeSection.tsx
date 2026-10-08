'use client';

import React from 'react';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';

export interface MarqueeSectionProps {
  marqueeTrack1Ref?: React.RefObject<HTMLDivElement | null>;
  marqueeTrack2Ref?: React.RefObject<HTMLDivElement | null>;
  marqueeImageRef?: React.RefObject<HTMLDivElement | null>;
}

export function MarqueeSection({
  marqueeTrack1Ref,
  marqueeTrack2Ref,
  marqueeImageRef,
}: MarqueeSectionProps) {
  const marqueeItems = Array(6).fill(null);

  return (
    <section
      className="relative w-full py-16 md:py-24 bg-cream overflow-clip select-none"
      aria-label={`${CONFIG.brandName} Marquee`}
    >
      {/* Top Track */}
      <div className="w-full overflow-clip mb-4 md:mb-8">
        <div
          ref={marqueeTrack1Ref}
          className="flex whitespace-nowrap will-change-transform"
          style={{ transform: 'translateX(-20%)' }}
        >
          {marqueeItems.map((_, i) => (
            <div
              key={`track1-${i}`}
              className="flex items-center gap-8 md:gap-16 px-4 md:px-8 font-display font-medium uppercase tracking-tight text-black/10 text-4xl sm:text-6xl md:text-8xl lg:text-9xl"
              aria-hidden={i > 0 ? 'true' : undefined}
            >
              <span>{CONFIG.brandName}</span>
              <span className="text-black/5 text-3xl sm:text-5xl md:text-7xl">—</span>
              <span>Wear the Movement</span>
              <span className="text-black/5 text-3xl sm:text-5xl md:text-7xl">—</span>
            </div>
          ))}
        </div>
      </div>

      {/* Photography Strip */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 my-6 md:my-10">
        <div
          ref={marqueeImageRef}
          className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden rounded-sm will-change-transform"
        >
          <Image
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&auto=format&fit=crop&q=80"
            alt="ZIPUP NATION Streetwear"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/15 via-transparent to-cream/15" />
        </div>
      </div>

      {/* Bottom Track */}
      <div className="w-full overflow-clip mt-4 md:mt-8">
        <div
          ref={marqueeTrack2Ref}
          className="flex whitespace-nowrap will-change-transform"
          style={{ transform: 'translateX(0%)' }}
        >
          {marqueeItems.map((_, i) => (
            <div
              key={`track2-${i}`}
              className="flex items-center gap-8 md:gap-16 px-4 md:px-8 font-display font-medium uppercase tracking-tight text-black/8 text-4xl sm:text-6xl md:text-8xl lg:text-9xl"
              aria-hidden="true"
            >
              <span>{CONFIG.brandHalves.left}</span>
              <span className="text-black/15">{CONFIG.brandHalves.right}</span>
              <span className="text-black/5 text-3xl sm:text-5xl md:text-7xl">—</span>
              <span>Made to Move</span>
              <span className="text-black/5 text-3xl sm:text-5xl md:text-7xl">—</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
