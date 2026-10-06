'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getProducts, getCategories, getCollections } from '@/lib/db';
import { ProductWithDetails, Category, Collection } from '@/lib/db/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Drawer } from '@/components/ui/Drawer';
import { AddProductPhotoModal } from '@/components/admin/AddProductPhotoModal';
import { Filter, X, Camera } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [addPhotoModalOpen, setAddPhotoModalOpen] = useState(false);

  // Filter & Sort State from URL params
  const genderParam = searchParams.get('gender') || '';
  const categoryParam = searchParams.get('category') || '';
  const collectionParam = searchParams.get('collection') || '';
  const sizeParam = searchParams.get('size') || '';
  const colorParam = searchParams.get('color') || '';
  const sortParam = (searchParams.get('sort') as any) || 'recommended';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cats, cols, prodData] = await Promise.all([
        getCategories(),
        getCollections(),
        getProducts({
          categorySlug: categoryParam,
          collectionSlug: collectionParam,
          gender: genderParam,
          sortBy: sortParam,
          page: pageParam,
          limit: 24,
        }),
      ]);

      setCategories(cats);
      setCollections(cols);

      // Filter by size/color locally if selected
      let filtered = prodData.products;
      if (sizeParam) {
        filtered = filtered.filter((p) => p.variants.some((v) => v.size === sizeParam && v.stock > 0));
      }
      if (colorParam) {
        filtered = filtered.filter((p) => p.variants.some((v) => v.colour.toLowerCase().includes(colorParam.toLowerCase())));
      }

      setProducts(filtered);
      setTotalCount(prodData.total);
      setLoading(false);
    }
    loadData();
  }, [genderParam, categoryParam, collectionParam, sizeParam, colorParam, sortParam, pageParam]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = categoryParam || collectionParam || sizeParam || colorParam || genderParam;

  return (
    <main className="flex-1 bg-cream min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Title & Count */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black pb-6 gap-4">
          <div>
            <span className="font-display text-xs font-bold text-cyan tracking-widest uppercase block mb-1">
              DIGITAL EXHIBITION CATALOGUE {genderParam && `// ${genderParam.toUpperCase()}`}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase text-black">
              {genderParam ? `${genderParam.toUpperCase()} ARCHIVE` : 'SHOP ARCHIVE'} ({totalCount})
            </h1>
          </div>

          {/* Sort Dropdown & Mobile Filter Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 border border-black bg-offwhite px-4 py-3 font-display text-xs font-bold uppercase"
            >
              <Filter className="w-4 h-4" />
              FILTERS {hasActiveFilters && '•'}
            </button>

            <Select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="w-48 bg-offwhite text-xs font-bold font-display uppercase border-black"
              options={[
                { label: 'SORT: RECOMMENDED', value: 'recommended' },
                { label: 'SORT: NEWEST ARRIVALS', value: 'newest' },
                { label: 'PRICE: LOW TO HIGH', value: 'price-asc' },
                { label: 'PRICE: HIGH TO LOW', value: 'price-desc' },
                { label: 'SORT: BEST RATED', value: 'rating' },
              ]}
            />
          </div>
        </div>

        {/* Removable Active Filter Chips (SHOP-4) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 bg-offwhite border border-grey p-3">
            <span className="font-display text-[11px] font-bold text-charcoal uppercase mr-2">
              ACTIVE FILTERS:
            </span>
            {genderParam && (
              <Badge variant="accent" className="flex items-center gap-1 cursor-pointer" onClick={() => updateParam('gender', '')}>
                SECTION: {genderParam.toUpperCase()} <X className="w-3 h-3" />
              </Badge>
            )}
            {categoryParam && (
              <Badge variant="accent" className="flex items-center gap-1 cursor-pointer" onClick={() => updateParam('category', '')}>
                CATEGORY: {categoryParam} <X className="w-3 h-3" />
              </Badge>
            )}
            {collectionParam && (
              <Badge variant="accent" className="flex items-center gap-1 cursor-pointer" onClick={() => updateParam('collection', '')}>
                COLLECTION: {collectionParam} <X className="w-3 h-3" />
              </Badge>
            )}
            {sizeParam && (
              <Badge variant="accent" className="flex items-center gap-1 cursor-pointer" onClick={() => updateParam('size', '')}>
                SIZE: {sizeParam} <X className="w-3 h-3" />
              </Badge>
            )}
            {colorParam && (
              <Badge variant="accent" className="flex items-center gap-1 cursor-pointer" onClick={() => updateParam('color', '')}>
                COLOR: {colorParam} <X className="w-3 h-3" />
              </Badge>
            )}
            <button
              onClick={clearAllFilters}
              className="font-display text-[11px] font-bold text-black hover:text-error-red uppercase underline ml-auto"
            >
              CLEAR ALL
            </button>
          </div>
        )}

        {/* Main Shop Layout: Left Sidebar + Right Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Desktop Filters Sidebar Shifted to Left Side (PRD §6.3 SHOP-2) */}
          <aside className="hidden md:flex md:col-span-3 flex-col gap-6 sticky top-28 bg-offwhite border-2 border-black p-6 shadow-[4px_4px_0px_0px_#111111]">
            {/* OWNER STUDIO ACTION: PHOTO ADDER */}
            <div className="bg-black text-cream p-4 border border-black flex flex-col gap-2">
              <span className="font-display text-[10px] font-bold text-cyan tracking-widest uppercase">
                ATELIER OWNER STUDIO
              </span>
              <button
                type="button"
                onClick={() => setAddPhotoModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-cyan text-black hover:bg-cream font-display text-xs font-bold py-2.5 px-3 uppercase transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>+ ADD PHOTO / GARMENT</span>
              </button>
            </div>

            <h3 className="font-display text-sm font-bold tracking-widest text-black uppercase border-b-2 border-black pb-2">
              SECTIONS & CLOTH TYPES
            </h3>

            {/* 1. DEPARTMENTS SHIFTED TO THE LEFT */}
            <div className="flex flex-col gap-2">
              <span className="font-display text-xs font-bold text-black uppercase tracking-wider flex items-center justify-between">
                <span>01 // DEPARTMENTS</span>
                <span className="text-[9px] text-cyan bg-black px-1.5 py-0.5 font-bold uppercase">LEFT NAV</span>
              </span>
              <div className="flex flex-col gap-1.5 pl-1 font-display text-xs">
                <button
                  type="button"
                  onClick={() => updateParam('gender', '')}
                  className={`text-left uppercase py-1.5 px-2.5 border transition-colors ${
                    !genderParam
                      ? 'bg-black text-cyan font-bold border-black'
                      : 'bg-offwhite text-charcoal border-transparent hover:border-black hover:text-black'
                  }`}
                >
                  ALL DEPARTMENTS
                </button>
                {[
                  { id: 'male', label: '1. MALE (MENSWEAR)' },
                  { id: 'female', label: '2. FEMALE (WOMENSWEAR)' },
                  { id: 'kids', label: '3. KIDS (JUNIOR)' },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => updateParam('gender', sec.id)}
                    className={`text-left uppercase py-1.5 px-2.5 border transition-colors ${
                      genderParam === sec.id
                        ? 'bg-black text-cyan font-bold border-black shadow-[2px_2px_0px_0px_#00D9FF]'
                        : 'bg-offwhite text-charcoal border-transparent hover:border-black hover:text-black'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. DIFFERENT KINDS OF CLOTH (CATEGORIES) ON THE LEFT */}
            <div className="flex flex-col gap-2 border-t-2 border-grey pt-4">
              <span className="font-display text-xs font-bold text-black uppercase tracking-wider">
                02 // KINDS OF CLOTH
              </span>
              <div className="flex flex-col gap-1.5 pl-1 font-display text-xs">
                <button
                  type="button"
                  onClick={() => updateParam('category', '')}
                  className={`text-left uppercase py-1.5 px-2.5 border transition-colors ${
                    !categoryParam
                      ? 'bg-black text-cyan font-bold border-black'
                      : 'bg-offwhite text-charcoal border-transparent hover:border-black hover:text-black'
                  }`}
                >
                  ALL KINDS OF CLOTH
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateParam('category', cat.slug)}
                    className={`text-left uppercase py-1.5 px-2.5 border transition-colors ${
                      categoryParam === cat.slug
                        ? 'bg-black text-cyan font-bold border-black shadow-[2px_2px_0px_0px_#00D9FF]'
                        : 'bg-offwhite text-charcoal border-transparent hover:border-black hover:text-black'
                    }`}
                  >
                    {cat.slug === 't-shirts' && '👕 '}
                    {cat.slug === 'shirts' && '👔 '}
                    {cat.slug === 'hoodies' && '🧥 '}
                    {cat.slug === 'jackets' && '🧥 '}
                    {cat.slug === 'bottoms' && '👖 '}
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div className="flex flex-col gap-2 border-t border-grey pt-4">
              <span className="font-display text-xs font-bold text-charcoal uppercase">COLLECTION</span>
              <div className="flex flex-col gap-1 pl-2 font-display text-xs">
                <button
                  onClick={() => updateParam('collection', '')}
                  className={`text-left uppercase py-1 ${!collectionParam ? 'font-bold text-black' : 'text-charcoal hover:text-black'}`}
                >
                  ALL COLLECTIONS
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => updateParam('collection', col.slug)}
                    className={`text-left uppercase py-1 ${collectionParam === col.slug ? 'font-bold text-cyan bg-black px-2' : 'text-charcoal hover:text-black'}`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector Filter */}
            <div className="flex flex-col gap-2 border-t border-grey pt-4">
              <span className="font-display text-xs font-bold text-charcoal uppercase">SIZE</span>
              <div className="grid grid-cols-3 gap-1.5">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateParam('size', sizeParam === sz ? '' : sz)}
                    className={`py-2 text-xs font-display font-bold border transition-colors ${
                      sizeParam === sz
                        ? 'bg-cyan text-black border-cyan font-bold'
                        : 'bg-cream text-black border-black/30 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <section className="md:col-span-9 flex flex-col gap-8">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
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
                  No garments match your active filters. Try clearing your selected category or size filter.
                </p>
                <Button variant="primary" onClick={clearAllFilters}>
                  CLEAR ALL FILTERS
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Pagination (SHOP-6) */}
                {products.length < totalCount && (
                  <div className="flex flex-col items-center justify-center pt-8 border-t border-grey gap-2">
                    <span className="font-display text-xs text-charcoal uppercase">
                      SHOWING {products.length} OF {totalCount} EXHIBITION ITEMS
                    </span>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => updateParam('page', (pageParam + 1).toString())}
                    >
                      LOAD MORE PRODUCTS
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Bottom Sheet Filters Drawer (SHOP-5) */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="FILTERS & FACETS"
        position="left"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-display text-xs font-bold text-charcoal uppercase">SECTION / DEPARTMENT</span>
            {[
              { id: 'male', label: '1. MALE (MENSWEAR)' },
              { id: 'female', label: '2. FEMALE (WOMENSWEAR)' },
              { id: 'kids', label: '3. KIDS (JUNIOR)' },
            ].map((sec) => (
              <Checkbox
                key={sec.id}
                label={sec.label}
                checked={genderParam === sec.id}
                onChange={() => {
                  updateParam('gender', genderParam === sec.id ? '' : sec.id);
                }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-grey pt-4">
            <span className="font-display text-xs font-bold text-charcoal uppercase">CATEGORY</span>
            {categories.map((cat) => (
              <Checkbox
                key={cat.id}
                label={cat.name}
                checked={categoryParam === cat.slug}
                onChange={() => {
                  updateParam('category', categoryParam === cat.slug ? '' : cat.slug);
                }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-grey pt-4">
            <span className="font-display text-xs font-bold text-charcoal uppercase">SIZE</span>
            <div className="grid grid-cols-3 gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateParam('size', sizeParam === sz ? '' : sz)}
                  className={`py-2 text-xs font-display font-bold border ${
                    sizeParam === sz ? 'bg-cyan text-black border-cyan' : 'bg-offwhite border-black'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={() => setMobileFiltersOpen(false)}>
            SHOW {totalCount} RESULTS
          </Button>
        </div>
      </Drawer>

      {/* Owner Add Photo & Garment Modal */}
      <AddProductPhotoModal
        isOpen={addPhotoModalOpen}
        onClose={() => setAddPhotoModalOpen(false)}
        initialGender={(genderParam as any) || 'male'}
        initialCategorySlug={categoryParam || 't-shirts'}
        onSuccess={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
      />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream pt-32 text-center">LOADING EXHIBITION ARCHIVE...</div>}>
      <ShopContent />
    </Suspense>
  );
}
