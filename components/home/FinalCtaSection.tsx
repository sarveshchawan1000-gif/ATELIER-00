'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export interface FinalCtaSectionProps {
  finalCtaImageRef?: React.RefObject<HTMLDivElement | null>;
  finalCtaContentRef?: React.RefObject<HTMLDivElement | null>;
}

export function FinalCtaSection({
  finalCtaImageRef,
  finalCtaContentRef,
}: FinalCtaSectionProps) {
  return (
    <section
      className="relative w-full h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black select-none"
      aria-label="Shop the Drop"
    >
      {/* Background Image */}
      <div
        ref={finalCtaImageRef}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src="https://images.unsplash.com/photo-1544441893-675973e31985?w=1800&auto=format&fit=crop&q=85"
          alt="ZIPUP NATION Campaign"
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div
        ref={finalCtaContentRef}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6 will-change-transform"
      >
        <h2
          className="font-display font-semibold tracking-tight uppercase text-white leading-[0.92] flex flex-col items-center justify-center gap-1"
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
        >
          <span>{CONFIG.brandHalves.left}</span>
          <span className="text-white/40">{CONFIG.brandHalves.right}</span>
        </h2>

        <p className="font-body text-sm sm:text-base md:text-lg text-white/60 max-w-md leading-relaxed mt-2">
          We don&apos;t follow the movement. We build it. Explore the full collection.
        </p>

        <div className="pt-4">
          <Link href="/collections/new-arrivals">
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-display font-medium tracking-wider uppercase px-10 py-4 transition-all cursor-pointer"
            >
              Enter the Drop <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
