'use client';

import React from 'react';
import Link from 'next/link';
import { ProductWithDetails } from '@/lib/db/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ArrowRight } from 'lucide-react';

export interface FeaturedSectionProps {
  products: ProductWithDetails[];
  sectionRef?: React.RefObject<HTMLDivElement | null>;
}

export function FeaturedSection({ products, sectionRef }: FeaturedSectionProps) {
  const displayProducts = products.slice(0, 8);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 px-4 md:px-8 bg-cream"
      aria-label="Featured Streetwear"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="border-b border-grey/60 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-body text-xs font-medium tracking-wider text-charcoal uppercase block mb-3">
              Featured — {displayProducts.length.toString().padStart(2, '0')} Pieces
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-black">
              Iconic Silhouettes
            </h2>
            <p className="font-body text-sm md:text-base text-charcoal mt-2 max-w-xl">
              Monolithic box tees, heavyweight French Terry hoodies, and architectural outerwear for street permanence.
            </p>
          </div>

          <Link
            href="/shop"
            className="font-body text-sm font-medium text-charcoal hover:text-black flex items-center gap-1.5 self-start md:self-auto transition-colors"
          >
            <span>Explore all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        {displayProducts.length === 0 ? (
          <div className="bg-offwhite p-12 text-center rounded-sm">
            <h3 className="font-display text-xl font-medium text-black">
              No featured garments in this drop
            </h3>
            <p className="font-body text-sm text-charcoal mt-2">
              Check back shortly or explore our full catalog.
            </p>
            <Link href="/shop" className="inline-block mt-6">
              <span className="font-body text-sm font-medium bg-black text-white px-6 py-3 hover:bg-charcoal transition-colors">
                View Catalog →
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {displayProducts.map((product) => (
              <div key={product.id} className="featured-card will-change-transform">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
