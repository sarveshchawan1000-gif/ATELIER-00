'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { getProducts, getCollections } from '@/lib/db';
import { ProductWithDetails, Collection } from '@/lib/db/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithDetails[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductWithDetails[]>([]);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const collectionStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const { products } = await getProducts({ limit: 8 });
      setFeaturedProducts(products.slice(0, 4));
      setNewArrivals(products);
      const cols = await getCollections();
      setCollections(cols);
    }
    loadData();
  }, []);

  // Subtle Hero Entrance Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (heroImageRef.current) gsap.set(heroImageRef.current, { opacity: 1 });
      if (heroContentRef.current) gsap.set(heroContentRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(heroImageRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' });
      gsap.fromTo(
        heroContentRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollCollection = (direction: 'left' | 'right') => {
    if (collectionStripRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      collectionStripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <main ref={heroRef} className="flex-1 flex flex-col bg-[#FAFAF8]">
      {/* 1. HERO SECTION - Clean, full-width, editorial */}
      <section className="relative min-h-[85vh] flex flex-col justify-end p-6 md:p-16 overflow-hidden border-b border-[#E8E6E1] pt-28">
        {/* Full-width Hero Image with subtle natural look */}
        <div
          ref={heroImageRef}
          className="absolute inset-0 z-0 opacity-0 transition-opacity"
        >
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=80"
            alt="ATELIER 00 Autumn-Winter Collection"
            fill
            priority
            className="object-cover object-center brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Hero Content in Sentence Case */}
        <div
          ref={heroContentRef}
          className="relative z-10 max-w-2xl text-white flex flex-col gap-4 opacity-0 pb-4"
        >
          <span className="text-xs font-normal tracking-[0.04em] text-white/80">
            Autumn–Winter 2026 Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-white leading-tight">
            Everyday essentials, thoughtfully made.
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-lg leading-relaxed font-normal">
            Refined architectural silhouettes, enduring fabrics, and considered details designed for daily life.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/shop">
              <Button variant="primary" size="lg" className="bg-white text-[#111111] hover:bg-[#F3F2EF]">
                Explore collection
              </Button>
            </Link>
            <Link href="/shop?gender=female">
              <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-[#111111]">
                Shop Women
              </Button>
            </Link>
            <Link href="/shop?gender=male">
              <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-[#111111]">
                Shop Men
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY DEPARTMENT (MALE / FEMALE / KIDS) */}
      <section className="py-20 md:py-24 px-6 md:px-12 border-b border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8E6E1] pb-4 gap-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111111]">
                Shop by Department
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-1">
                Thoughtful tailoring across menswear, womenswear, and junior atelier foundations.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs md:text-sm text-[#6B6B6B] hover:text-[#111111] hover:underline underline-offset-4 self-start md:self-auto transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Men */}
            <Link
              href="/shop?gender=male"
              className="group flex flex-col bg-transparent rounded-none focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F2EF]">
                <Image
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"
                  alt="Men's Collection"
                  fill
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-400 ease-out"
                />
              </div>
              <div className="pt-4 flex flex-col gap-1">
                <h3 className="text-lg md:text-xl font-medium text-[#111111]">
                  Men
                </h3>
                <p className="text-[13px] text-[#6B6B6B] leading-relaxed">
                  Relaxed tailoring, heavyweight cotton tees, and structured outerwear.
                </p>
                <span className="text-[13px] font-normal text-[#111111] group-hover:underline underline-offset-4 decoration-1 mt-1 inline-flex items-center gap-1">
                  Shop Men →
                </span>
              </div>
            </Link>

            {/* Women */}
            <Link
              href="/shop?gender=female"
              className="group flex flex-col bg-transparent rounded-none focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F2EF]">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80"
                  alt="Women's Collection"
                  fill
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-400 ease-out"
                />
              </div>
              <div className="pt-4 flex flex-col gap-1">
                <h3 className="text-lg md:text-xl font-medium text-[#111111]">
                  Women
                </h3>
                <p className="text-[13px] text-[#6B6B6B] leading-relaxed">
                  Sculptural wool coats, sandwashed mulberry silk, and fluid palazzo trousers.
                </p>
                <span className="text-[13px] font-normal text-[#111111] group-hover:underline underline-offset-4 decoration-1 mt-1 inline-flex items-center gap-1">
                  Shop Women →
                </span>
              </div>
            </Link>

            {/* Kids */}
            <Link
              href="/shop?gender=kids"
              className="group flex flex-col bg-transparent rounded-none focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F2EF]">
                <Image
                  src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"
                  alt="Kids Collection"
                  fill
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-400 ease-out"
                />
              </div>
              <div className="pt-4 flex flex-col gap-1">
                <h3 className="text-lg md:text-xl font-medium text-[#111111]">
                  Kids
                </h3>
                <p className="text-[13px] text-[#6B6B6B] leading-relaxed">
                  Durable organic cotton basics, French Terry hoodies, and comfortable cargos.
                </p>
                <span className="text-[13px] font-normal text-[#111111] group-hover:underline underline-offset-4 decoration-1 mt-1 inline-flex items-center gap-1">
                  Shop Kids →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY ("KINDS OF CLOTH") */}
      <section className="py-20 md:py-24 px-6 md:px-12 border-b border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8E6E1] pb-4 gap-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111111]">
                Shop by Category
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-1">
                Everyday essentials, thoughtfully made.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs md:text-sm text-[#6B6B6B] hover:text-[#111111] hover:underline underline-offset-4 self-start md:self-auto transition-colors"
            >
              View all →
            </Link>
          </div>

          {/* 5 columns on desktop, 3 on tablet, carousel/2 cols on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-6">
            {[
              {
                title: 'Tees & Basics',
                slug: 't-shirts',
                img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
                count: '3 pieces',
              },
              {
                title: 'Tailored Shirts',
                slug: 'shirts',
                img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
                count: '2 pieces',
              },
              {
                title: 'Hoodies & Fleece',
                slug: 'hoodies',
                img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
                count: '2 pieces',
              },
              {
                title: 'Outerwear & Jackets',
                slug: 'jackets',
                img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
                count: '2 pieces',
              },
              {
                title: 'Bottoms & Pants',
                slug: 'bottoms',
                img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
                count: '2 pieces',
              },
            ].map((cloth) => (
              <Link
                key={cloth.slug}
                href={`/shop/${cloth.slug}`}
                className="group flex flex-col bg-transparent rounded-none focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3F2EF] rounded-none">
                  <Image
                    src={cloth.img}
                    alt={cloth.title}
                    fill
                    className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-400 ease-out"
                  />
                </div>
                <div className="pt-3 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-medium text-[#111111]">
                      {cloth.title}
                    </h3>
                    <span className="text-xs text-[#111111] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:inline">
                      Shop →
                    </span>
                  </div>
                  <span className="text-[13px] text-[#6B6B6B]">
                    {cloth.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="py-20 md:py-24 px-6 md:px-12 border-b border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
          <div className="flex items-end justify-between border-b border-[#E8E6E1] pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111111]">
                Featured Products
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-1">
                Handpicked highlights from the studio exhibition.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs md:text-sm text-[#6B6B6B] hover:text-[#111111] hover:underline underline-offset-4 transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CURATED COLLECTIONS STRIP */}
      <section className="py-20 md:py-24 px-6 md:px-12 border-b border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
          <div className="flex items-end justify-between border-b border-[#E8E6E1] pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111111]">
                Curated Collections
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-1">
                Cohesive capsule concepts defined by silhouette and materiality.
              </p>
            </div>

            {/* Scroll Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCollection('left')}
                aria-label="Scroll collections left"
                className="p-2 border border-[#E8E6E1] bg-white hover:border-[#111111] text-[#111111] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                onClick={() => scrollCollection('right')}
                aria-label="Scroll collections right"
                className="p-2 border border-[#E8E6E1] bg-white hover:border-[#111111] text-[#111111] transition-colors"
              >
                <ChevronRight className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Scrollable Strip */}
          <div
            ref={collectionStripRef}
            className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 scroll-smooth"
            tabIndex={0}
            aria-label="Scrollable collection strip"
          >
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="snap-start flex-shrink-0 w-80 md:w-96 bg-white border border-[#E8E6E1] p-6 flex flex-col justify-between h-56 group hover:border-[#111111] transition-colors rounded-none"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-normal text-[#6B6B6B] tracking-[0.04em]">
                    Collection 0{col.display_order}
                  </span>
                  <span className="text-xs text-[#111111] group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-medium text-[#111111] group-hover:text-[#6B6B6B] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs md:text-sm text-[#6B6B6B] mt-2 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
          <div className="flex items-end justify-between border-b border-[#E8E6E1] pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111111]">
                New Arrivals
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-1">
                The latest release from the Atelier workshop.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs md:text-sm text-[#6B6B6B] hover:text-[#111111] hover:underline underline-offset-4 transition-colors"
            >
              Explore all ({newArrivals.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
