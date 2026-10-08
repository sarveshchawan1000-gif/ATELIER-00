'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export interface StorySectionProps {
  storyImageRef?: React.RefObject<HTMLDivElement | null>;
  storyTextRef?: React.RefObject<HTMLDivElement | null>;
}

export function StorySection({ storyImageRef, storyTextRef }: StorySectionProps) {
  return (
    <section
      className="py-24 md:py-36 px-4 md:px-8 bg-cream overflow-clip select-none"
      aria-label="Our Story"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Editorial Photography */}
        <div className="md:col-span-6 lg:col-span-6">
          <div
            ref={storyImageRef}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-sm will-change-transform"
          >
            <Image
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop&q=85"
              alt="ZIPUP NATION Garment Craftsmanship"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Story Text */}
        <div
          ref={storyTextRef}
          className="md:col-span-6 lg:col-span-6 flex flex-col justify-center gap-8 will-change-transform"
        >
          <div className="space-y-4">
            <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase">
              Our Story
            </span>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl font-semibold tracking-tight text-black leading-[1.05]">
              We don&apos;t follow
              the movement.
              <br />
              <span className="text-charcoal">
                We build it.
              </span>
            </h2>
          </div>

          <div className="space-y-4 font-body text-base sm:text-lg text-charcoal leading-relaxed max-w-lg border-l border-grey pl-6 py-2">
            <p>
              Born from structural architecture and heavy street culture. We engineer garments that hold their weight and silhouette across every environment.
            </p>
            <p className="text-sm text-charcoal/70">
              Every drop is developed in small batches using 320–450 GSM organic cotton and weatherproof outer shells.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/about">
              <Button
                variant="primary"
                size="lg"
                className="bg-black text-white hover:bg-charcoal font-display font-medium tracking-wider uppercase transition-all"
              >
                Our Movement <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
