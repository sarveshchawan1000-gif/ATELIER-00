'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getProducts, getCategories, getCollections } from '@/lib/db';
import { ProductWithDetails, Category, Collection } from '@/lib/db/types';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { AddProductPhotoModal } from '@/components/admin/AddProductPhotoModal';
import { Filter, X, ChevronDown, Plus } from 'lucide-react';

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

  // Accordion open/close state
  const [departmentOpen, setDepartmentOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);

  // Filter & Sort State from URL params
  const genderParam = searchParams.get('gender') || '';
  const categoryParam = searchParams.get('category') || '';
  const collectionParam = searchParams.get('collection') || '';
  const sizeParam = searchParams.get('size') || '';
  const colorParam = searchParams.get('color') || '';
  const sortParam = searchParams.get('sort') || 'recommended';
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
          sortBy: (sortParam as 'recommended' | 'newest' | 'price-asc' | 'price-desc' | 'rating') || 'recommended',
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

  // Title mapping: male -> Men, female -> Women, kids -> Kids
  const getPageTitle = () => {
    if (genderParam === 'male') return 'Men';
    if (genderParam === 'female') return 'Women';
    if (genderParam === 'kids') return 'Kids';
    if (categoryParam) {
      const cat = categories.find((c) => c.slug === categoryParam);
      if (cat) return cat.name;
      return categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
    }
    if (collectionParam) {
      const col = collections.find((c) => c.slug === collectionParam);
      if (col) return col.name;
      return collectionParam.charAt(0).toUpperCase() + collectionParam.slice(1);
    }
    return 'All Garments';
  };

  const pageTitle = getPageTitle();

  return (
    <main className="flex-1 bg-[#FAFAF8] min-h-screen pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#6B6B6B]">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#111111]">{pageTitle}</span>
        </nav>

        {/* Page Header: Title + Item Count + Sort / Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-[#E8E6E1] pb-6 gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111111]">
              {pageTitle}
            </h1>
            <span className="text-sm text-[#6B6B6B]">
              {totalCount} {totalCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Desktop Sort Dropdown + Mobile Buttons */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 border border-[#E8E6E1] bg-white px-4 py-2.5 text-[13px] text-[#111111]"
            >
              <Filter className="w-4 h-4 stroke-[1.5]" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sort Control */}
            <div className="relative">
              <select
                aria-label="Sort products"
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="appearance-none bg-transparent hover:border-[#111111] border border-[#E8E6E1] text-[13px] md:text-[14px] text-[#111111] py-2.5 pl-3 pr-8 cursor-pointer focus:outline-none focus:border-black rounded-none transition-colors"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="newest">Sort by: Newest</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
                <option value="rating">Sort by: Best rated</option>
              </select>
              <ChevronDown className="w-4 h-4 stroke-[1.5] text-[#111111] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Removable Active Filter Chips: transparent background, 1px #D9D6D0 border, 999px radius */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {genderParam && (
              <button
                onClick={() => updateParam('gender', '')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-transparent border border-[#D9D6D0] rounded-full text-[13px] text-[#111111] hover:border-[#111111] transition-colors"
              >
                <span>Department: {genderParam === 'male' ? 'Men' : genderParam === 'female' ? 'Women' : 'Kids'}</span>
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            )}
            {categoryParam && (
              <button
                onClick={() => updateParam('category', '')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-transparent border border-[#D9D6D0] rounded-full text-[13px] text-[#111111] hover:border-[#111111] transition-colors"
              >
                <span>
                  Category: {categories.find((c) => c.slug === categoryParam)?.name || categoryParam}
                </span>
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            )}
            {collectionParam && (
              <button
                onClick={() => updateParam('collection', '')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-transparent border border-[#D9D6D0] rounded-full text-[13px] text-[#111111] hover:border-[#111111] transition-colors"
              >
                <span>Collection: {collections.find((c) => c.slug === collectionParam)?.name || collectionParam}</span>
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            )}
            {sizeParam && (
              <button
                onClick={() => updateParam('size', '')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-transparent border border-[#D9D6D0] rounded-full text-[13px] text-[#111111] hover:border-[#111111] transition-colors"
              >
                <span>Size: {sizeParam}</span>
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            )}
            {colorParam && (
              <button
                onClick={() => updateParam('color', '')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-transparent border border-[#D9D6D0] rounded-full text-[13px] text-[#111111] hover:border-[#111111] transition-colors"
              >
                <span>Color: {colorParam}</span>
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[13px] text-[#6B6B6B] hover:text-[#111111] underline underline-offset-4 ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Shop Layout: Left Sticky Sidebar + Right Product Grid */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Desktop Filters Sidebar: ~240px wide transparent sticky column */}
          <aside className="hidden md:flex w-60 flex-shrink-0 flex-col sticky top-24">
            {/* Department Accordion */}
            <div className="pb-6">
              <button
                onClick={() => setDepartmentOpen(!departmentOpen)}
                className="w-full flex items-center justify-between text-[13px] font-semibold text-[#111111] py-1 text-left"
              >
                <span>Department</span>
                <ChevronDown
                  className={`w-4 h-4 stroke-[1.5] transition-transform duration-200 ${
                    departmentOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {departmentOpen && (
                <div className="flex flex-col gap-1 pt-3 text-[14px]">
                  <button
                    type="button"
                    onClick={() => updateParam('gender', '')}
                    className={`text-left py-1.5 transition-colors flex items-center gap-2 ${
                      !genderParam
                        ? 'text-[#111111] font-medium before:content-[""] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#111111]'
                        : 'text-[#444444] hover:text-[#111111]'
                    }`}
                  >
                    <span>All Departments</span>
                  </button>
                  {[
                    { id: 'male', label: 'Men' },
                    { id: 'female', label: 'Women' },
                    { id: 'kids', label: 'Kids' },
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => updateParam('gender', sec.id)}
                      className={`text-left py-1.5 transition-colors flex items-center gap-2 ${
                        genderParam === sec.id
                          ? 'text-[#111111] font-medium before:content-[""] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#111111]'
                          : 'text-[#444444] hover:text-[#111111]'
                      }`}
                    >
                      <span>{sec.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Accordion */}
            <div className="border-t border-[#E8E6E1] pt-6 pb-6">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full flex items-center justify-between text-[13px] font-semibold text-[#111111] py-1 text-left"
              >
                <span>Category</span>
                <ChevronDown
                  className={`w-4 h-4 stroke-[1.5] transition-transform duration-200 ${
                    categoryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {categoryOpen && (
                <div className="flex flex-col gap-1 pt-3 text-[14px]">
                  <button
                    type="button"
                    onClick={() => updateParam('category', '')}
                    className={`text-left py-1.5 transition-colors flex items-center gap-2 ${
                      !categoryParam
                        ? 'text-[#111111] font-medium before:content-[""] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#111111]'
                        : 'text-[#444444] hover:text-[#111111]'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateParam('category', cat.slug)}
                      className={`text-left py-1.5 transition-colors flex items-center gap-2 ${
                        categoryParam === cat.slug
                          ? 'text-[#111111] font-medium before:content-[""] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#111111]'
                          : 'text-[#444444] hover:text-[#111111]'
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Size Accordion */}
            <div className="border-t border-[#E8E6E1] pt-6 pb-6">
              <button
                onClick={() => setSizeOpen(!sizeOpen)}
                className="w-full flex items-center justify-between text-[13px] font-semibold text-[#111111] py-1 text-left"
              >
                <span>Size</span>
                <ChevronDown
                  className={`w-4 h-4 stroke-[1.5] transition-transform duration-200 ${
                    sizeOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {sizeOpen && (
                <div className="grid grid-cols-3 gap-1.5 pt-3">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => updateParam('size', sizeParam === sz ? '' : sz)}
                      className={`py-2 text-xs border transition-colors ${
                        sizeParam === sz
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-transparent text-[#111111] border-[#E8E6E1] hover:border-[#111111]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Small Ghost Button for Admin to Add Garment */}
            <div className="border-t border-[#E8E6E1] pt-6">
              <button
                type="button"
                onClick={() => setAddPhotoModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#111111] transition-colors py-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Add garment</span>
              </button>
            </div>
          </aside>

          {/* Right Product Grid */}
          <section className="flex-1 w-full flex flex-col gap-8">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center gap-3 bg-white p-8 border border-[#E8E6E1]">
                <h3 className="text-lg font-medium text-[#111111]">
                  No products found
                </h3>
                <p className="text-sm text-[#6B6B6B] max-w-sm">
                  We couldn&apos;t find any garments matching your selected filters. Try clearing your filters to see more results.
                </p>
                <Button variant="secondary" size="sm" onClick={clearAllFilters} className="mt-2">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                {/* 3 cols desktop beside sidebar, 2 tablet, 2 mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Pagination */}
                {products.length < totalCount && (
                  <div className="flex flex-col items-center justify-center pt-8 border-t border-[#E8E6E1] gap-3">
                    <span className="text-xs text-[#6B6B6B]">
                      Showing {products.length} of {totalCount} items
                    </span>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => updateParam('page', (pageParam + 1).toString())}
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Bottom Sheet Filters Drawer */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filter"
        position="left"
      >
        <div className="flex flex-col gap-6 pt-2">
          {/* Department */}
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-semibold text-[#111111]">Department</span>
            <div className="flex flex-col gap-2">
              {[
                { id: 'male', label: 'Men' },
                { id: 'female', label: 'Women' },
                { id: 'kids', label: 'Kids' },
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => updateParam('gender', genderParam === sec.id ? '' : sec.id)}
                  className={`text-left text-sm py-1.5 flex items-center justify-between ${
                    genderParam === sec.id ? 'font-medium text-[#111111]' : 'text-[#6B6B6B]'
                  }`}
                >
                  <span>{sec.label}</span>
                  {genderParam === sec.id && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-3 border-t border-[#E8E6E1] pt-4">
            <span className="text-[13px] font-semibold text-[#111111]">Category</span>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', categoryParam === cat.slug ? '' : cat.slug)}
                  className={`text-left text-sm py-1.5 flex items-center justify-between ${
                    categoryParam === cat.slug ? 'font-medium text-[#111111]' : 'text-[#6B6B6B]'
                  }`}
                >
                  <span>{cat.name}</span>
                  {categoryParam === cat.slug && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-3 border-t border-[#E8E6E1] pt-4">
            <span className="text-[13px] font-semibold text-[#111111]">Size</span>
            <div className="grid grid-cols-3 gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateParam('size', sizeParam === sz ? '' : sz)}
                  className={`py-2 text-xs border ${
                    sizeParam === sz ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white border-[#E8E6E1] text-[#111111]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E6E1] flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                clearAllFilters();
                setMobileFiltersOpen(false);
              }}
            >
              Reset
            </Button>
            <Button variant="primary" fullWidth onClick={() => setMobileFiltersOpen(false)}>
              Show {totalCount} items
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Owner Add Photo Modal */}
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
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8] pt-32 text-center text-sm text-[#6B6B6B]">Loading catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
