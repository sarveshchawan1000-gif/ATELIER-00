'use client';

import React from 'react';
import Link from 'next/link';
import { ProductWithDetails } from '@/lib/db/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ArrowRight } from 'lucide-react';

export interface NewDropsSectionProps {
  products: ProductWithDetails[];
  sectionRef?: React.RefObject<HTMLDivElement | null>;
}

export function NewDropsSection({ products, sectionRef }: NewDropsSectionProps) {
  // Sort newest first and take 4
  const newestProducts = [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 px-4 md:px-8 bg-cream"
      aria-label="New Drops"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="border-b border-grey/60 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase block mb-3">
              Latest Releases
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-black">
              New Drops
            </h2>
            <p className="font-body text-sm md:text-base text-charcoal mt-2 max-w-xl">
              Recently manufactured pieces straight from our pattern room. Limited initial run.
            </p>
          </div>

          <Link
            href="/collections/new-arrivals"
            className="font-body text-sm font-medium text-charcoal hover:text-black flex items-center gap-1.5 self-start md:self-auto transition-colors"
          >
            <span>View all new arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {newestProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`new-drop-card will-change-transform ${
                idx % 2 === 0 ? 'drop-dir-left' : 'drop-dir-right'
              }`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
