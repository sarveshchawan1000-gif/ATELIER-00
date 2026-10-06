'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/lib/db';
import { ProductWithDetails } from '@/lib/db/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getProducts({ searchQuery: query, limit: 24 });
      setProducts(res.products);
      setLoading(false);
    }
    loadData();
  }, [query]);

  return (
    <main className="flex-1 bg-cream min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="border-b border-black pb-6">
          <span className="font-display text-xs font-bold text-cyan tracking-widest uppercase block mb-1">
            SEARCH RESULTS
          </span>
          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight uppercase text-black">
            SEARCH: &quot;{query}&quot; ({products.length})
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4 bg-offwhite border border-black p-8">
            <h3 className="font-display text-lg font-bold text-black uppercase">
              NOTHING HERE. TRY ANOTHER CATEGORY OR SEARCH.
            </h3>
            <p className="font-body text-xs text-charcoal max-w-md">
              No garments found matching &quot;{query}&quot;. Check your spelling or try searching for general categories like T-Shirts or Hoodies.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream pt-32 text-center">LOADING SEARCH RESULTS...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
