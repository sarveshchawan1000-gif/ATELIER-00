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
      <div className="bg-[#FAFAF8] border-b border-[#E8E6E1] p-6 md:p-10 w-full shadow-lg animate-in slide-in-from-top duration-200">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider text-[#6B6B6B] uppercase">
              Search the Atelier
            </span>
            <button
              onClick={onClose}
              aria-label="Close search overlay"
              className="p-1.5 text-[#111] hover:text-[#6B6B6B] transition-colors rounded-sm"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-[#6B6B6B] stroke-[1.5] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, styles..."
              className="w-full bg-white border border-[#E8E6E1] pl-12 pr-16 py-3.5 text-sm md:text-base text-[#111] placeholder:text-[#6B6B6B]/60 rounded-none focus:outline-none focus:border-[#111] transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 text-xs font-medium text-[#6B6B6B] hover:text-[#111] transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          {/* Quick Popular Search Tags */}
          {!query && (
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-[11px] font-medium text-[#6B6B6B] tracking-wider uppercase">
                Popular searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3.5 py-1.5 bg-transparent border border-[#D9D6D0] hover:border-[#111] hover:text-[#111] text-xs text-[#6B6B6B] rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Search Results */}
          {query.trim() && (
            <div className="flex flex-col gap-4 pt-4 border-t border-[#E8E6E1]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6B6B6B]">
                  {isSearching ? 'Searching...' : `${results.length} results`}
                </span>
                {results.length > 0 && (
                  <button
                    onClick={handleSubmit}
                    className="text-xs font-medium text-[#111] hover:text-[#6B6B6B] underline underline-offset-4 transition-colors"
                  >
                    View all results →
                  </button>
                )}
              </div>

              {results.length === 0 && !isSearching ? (
                <div className="py-8 text-center flex flex-col items-center gap-1.5">
                  <p className="text-sm font-medium text-[#111]">
                    No garments found
                  </p>
                  <p className="text-xs text-[#6B6B6B]">
                    No garments matching &quot;{query}&quot;. Try another search term.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="group flex flex-col gap-2 transition-colors"
                    >
                      <div className="relative aspect-[3/4] bg-[#F3F2EF] overflow-hidden">
                        <Image
                          src={product.images[0]?.url || ''}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-400 ease-out"
                        />
                      </div>
                      <h4 className="text-xs font-medium text-[#111] line-clamp-1">
                        {product.name}
                      </h4>
                      <span className="text-xs text-[#6B6B6B]">
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
