'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/db';
import { ProductWithDetails } from '@/lib/db/types';
import { formatINR } from '@/lib/pricing';
import { Search, X } from 'lucide-react';

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductWithDetails[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const res = await getProducts({ searchQuery: query, limit: 6 });
      setResults(res.products);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  const popularSearches = ['T-Shirts', 'Hoodies', 'Jackets', 'New Arrivals', 'Oversized', 'Black'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-none flex flex-col justify-start animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-cream border-b border-black p-6 md:p-10 w-full shadow-2xl animate-in slide-in-from-top duration-200">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-bold tracking-widest text-charcoal uppercase">
              WHAT ARE YOU LOOKING FOR?
            </span>
            <button
              onClick={onClose}
              aria-label="Close search overlay"
              className="p-2 text-black hover:bg-cyan font-bold text-sm transition-colors border border-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-6 h-6 text-black pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH EXHIBITION PRODUCTS, CATEGORIES, SKUS..."
              className="w-full bg-offwhite border-2 border-black pl-14 pr-12 py-4 font-display text-sm md:text-base font-bold text-black uppercase tracking-wider placeholder:text-charcoal/50 rounded-none focus:outline-none focus:border-black"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 text-xs font-bold font-display uppercase hover:text-error-red"
              >
                CLEAR
              </button>
            )}
          </form>

          {/* Quick Popular Search Tags */}
          {!query && (
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-display text-[10px] font-bold text-charcoal tracking-widest uppercase">
                POPULAR SEARCHES:
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-offwhite border border-grey hover:border-black hover:bg-cyan font-display text-xs tracking-wider uppercase transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Search Results */}
          {query.trim() && (
            <div className="flex flex-col gap-4 pt-4 border-t border-grey">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold tracking-wider uppercase text-black">
                  {isSearching ? 'SEARCHING...' : `FOUND ${results.length} RESULTS`}
                </span>
                {results.length > 0 && (
                  <button
                    onClick={handleSubmit}
                    className="font-display text-xs font-bold text-black hover:text-cyan uppercase underline"
                  >
                    VIEW ALL RESULTS →
                  </button>
                )}
              </div>

              {results.length === 0 && !isSearching ? (
                <div className="py-8 text-center flex flex-col items-center gap-2">
                  <p className="font-display text-sm font-bold text-black uppercase">
                    NOTHING HERE. TRY ANOTHER CATEGORY OR SEARCH.
                  </p>
                  <p className="font-body text-xs text-charcoal">
                    No garments found matching &quot;{query}&quot;.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="group flex flex-col gap-2 border border-grey bg-offwhite p-2 hover:border-black transition-colors"
                    >
                      <div className="relative aspect-[4/5] bg-grey/20 overflow-hidden">
                        <Image
                          src={product.images[0]?.url || ''}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-display text-[11px] font-bold text-black uppercase line-clamp-1 group-hover:text-cyan">
                        {product.name}
                      </h4>
                      <span className="font-display text-[10px] font-bold text-charcoal">
                        {formatINR(product.sale_price || product.mrp)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
