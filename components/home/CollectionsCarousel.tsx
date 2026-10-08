'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection, ProductWithDetails } from '@/lib/db/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface CollectionsCarouselProps {
  collections: Collection[];
  products: ProductWithDetails[];
}

const COLLECTION_IMAGERY: Record<string, string> = {
  'new-arrivals': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80',
  'best-sellers': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80',
  'heavy-hoodies': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80',
  'technical-outerwear': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1000&auto=format&fit=crop&q=80',
};

export function CollectionsCarousel({ collections, products }: CollectionsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'prev' | 'next') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'prev' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section
      className="py-20 md:py-32 px-4 md:px-8 bg-cream overflow-clip"
      aria-label="Curated Collections"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-grey/60 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase block mb-3">
              Collections
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-black">
              Curated Drops
            </h2>
            <p className="font-body text-sm md:text-base text-charcoal mt-2 max-w-xl">
              Cohesive streetwear series structured by fabric density, architectural cuts, and functional utility.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('prev')}
              aria-label="Scroll collections left"
              className="w-10 h-10 bg-offwhite border border-grey/60 flex items-center justify-center text-charcoal hover:text-black hover:border-black/30 transition-all cursor-pointer rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('next')}
              aria-label="Scroll collections right"
              className="w-10 h-10 bg-offwhite border border-grey/60 flex items-center justify-center text-charcoal hover:text-black hover:border-black/30 transition-all cursor-pointer rounded-full"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          aria-label="Collections list"
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory py-2 scrollbar-none scroll-smooth focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
        >
          {collections.map((col) => {
            const count = products.filter((p) =>
              p.collections.some((c) => c.slug === col.slug)
            ).length;
            const bgImage =
              COLLECTION_IMAGERY[col.slug] ||
              'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80';

            return (
              <article
                key={col.id}
                className="snap-start flex-shrink-0 w-[85vw] sm:w-[360px] md:w-[400px] bg-offwhite border border-grey/40 flex flex-col justify-between overflow-hidden rounded-sm hover:shadow-md transition-shadow group"
              >
                {/* Visual */}
                <Link
                  href={`/shop?collection=${encodeURIComponent(col.slug)}`}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-black/5 block"
                >
                  <Image
                    src={bgImage}
                    alt={`${col.name} Collection`}
                    fill
                    sizes="(max-width: 768px) 85vw, 400px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute bottom-3 right-3 bg-white/85 backdrop-blur-sm text-black px-2.5 py-1 font-body text-[11px] font-medium tracking-wide rounded-sm">
                    {count} {count === 1 ? 'piece' : 'pieces'}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1 gap-5 border-t border-grey/30">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-black group-hover:text-charcoal transition-colors">
                      <Link href={`/shop?collection=${encodeURIComponent(col.slug)}`}>
                        {col.name}
                      </Link>
                    </h3>
                    <p className="font-body text-sm text-charcoal leading-relaxed line-clamp-2">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-grey/20 flex items-center justify-between">
                    <Link
                      href={`/shop?collection=${encodeURIComponent(col.slug)}`}
                      className="font-body text-sm font-medium text-charcoal flex items-center gap-1.5 group-hover:text-black transition-colors"
                    >
                      <span>View collection</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
