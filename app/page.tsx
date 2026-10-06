'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProducts, getCollections } from '@/lib/db';
import { ProductWithDetails, Collection } from '@/lib/db/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { CONFIG } from '@/lib/config';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithDetails[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductWithDetails[]>([]);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const leftWordmarkRef = useRef<HTMLHeadingElement>(null);
  const rightWordmarkRef = useRef<HTMLHeadingElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
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

  // GSAP Signature Split Wordmark Entrance Timeline (PRD §6.1 & §7)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || skipAnimation) {
      if (leftWordmarkRef.current) gsap.set(leftWordmarkRef.current, { x: 0, opacity: 1 });
      if (rightWordmarkRef.current) gsap.set(rightWordmarkRef.current, { x: 0, opacity: 1 });
      if (heroImageRef.current) gsap.set(heroImageRef.current, { opacity: 1, scale: 1 });
      if (heroCtaRef.current) gsap.set(heroCtaRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 0ms: LCP Hero Image paint (preloaded)
      // 200ms: Model image fades & scales in
      tl.to(heroImageRef.current, { opacity: 1, scale: 1, duration: 0.6 }, 0.2);

      // 300-1100ms: Split wordmark halves slide in from left/right edges and merge
      tl.fromTo(
        leftWordmarkRef.current,
        { x: '-100vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        0.3
      );
      tl.fromTo(
        rightWordmarkRef.current,
        { x: '100vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        0.3
      );

      // 1200ms: CTA appears
      tl.to(heroCtaRef.current, { opacity: 1, y: 0, duration: 0.4 }, 1.2);
    }, heroRef);

    return () => ctx.revert();
  }, [skipAnimation]);

  const scrollCollection = (direction: 'left' | 'right') => {
    if (collectionStripRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      collectionStripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <main ref={heroRef} className="flex-1 flex flex-col bg-cream">
      {/* HERO SECTION (PRD §6.1) */}
      <section className="relative min-h-[90vh] flex flex-col justify-between p-6 md:p-12 overflow-hidden border-b border-black pt-28">
        {/* Skip Animation Button */}
        {!skipAnimation && (
          <button
            onClick={() => setSkipAnimation(true)}
            className="absolute top-24 right-6 z-30 font-display text-[10px] font-bold tracking-widest text-charcoal uppercase hover:text-black bg-cream/80 px-2 py-1 border border-grey"
          >
            SKIP INTRO ➔
          </button>
        )}

        {/* Hero Product Image (LCP Element) */}
        <div
          ref={heroImageRef}
          className="absolute inset-0 z-0 opacity-0 scale-95 transition-transform"
        >
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=80"
            alt="ATELIER 00 Signature Fashion Hero Exhibition"
            fill
            priority
            className="object-cover object-center opacity-25"
          />
        </div>

        {/* Top Hero Subtitle */}
        <div className="relative z-10 flex justify-between items-start pt-4 font-display text-xs tracking-widest text-charcoal uppercase border-b border-charcoal/20 pb-4">
          <span>EXHIBITION 01 // AUTUMN-WINTER 2026</span>
          <span className="hidden md:inline">MUMBAI, INDIA</span>
        </div>

        {/* Signature Split Wordmark Entrance */}
        <div className="relative z-10 my-auto py-12 flex flex-col items-center justify-center overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-center font-display font-bold tracking-tighter uppercase leading-none text-[12vw] md:text-[10vw] select-none text-black gap-2 md:gap-6">
            <h1 ref={leftWordmarkRef} className="will-change-transform">
              ATELIER
            </h1>
            <h1 ref={rightWordmarkRef} className="will-change-transform">
              00
            </h1>
          </div>
          <p className="font-body text-xs md:text-sm text-charcoal tracking-widest uppercase mt-4 max-w-md text-center">
            Architectural Garment Engineering & Monolithic Editorial Curation
          </p>
        </div>

        {/* Hero CTA Row */}
        <div
          ref={heroCtaRef}
          className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 opacity-0 translate-y-4 pt-4 border-t border-charcoal/20"
        >
          <span className="font-display text-xs tracking-widest text-charcoal uppercase">
            3 DISTINCT ATELIER DEPARTMENTS // GST INCLUSIVE
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/shop?gender=male">
              <Button variant="secondary" size="sm" className="bg-cream hover:bg-cyan text-xs font-bold">
                1. MALE
              </Button>
            </Link>
            <Link href="/shop?gender=female">
              <Button variant="secondary" size="sm" className="bg-cream hover:bg-cyan text-xs font-bold">
                2. FEMALE
              </Button>
            </Link>
            <Link href="/shop?gender=kids">
              <Button variant="secondary" size="sm" className="bg-cream hover:bg-cyan text-xs font-bold">
                3. KIDS
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="primary" size="sm" className="bg-black text-cream hover:bg-cyan hover:text-black text-xs font-bold">
                ALL PIECES
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 CORE SECTIONS SHOWCASE: 1 MALE, 2 FEMALE, 3 KIDS */}
      <section className="py-20 px-6 md:px-12 border-b border-black bg-cream">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black pb-4 gap-2">
            <div>
              <span className="font-display text-xs font-bold text-cyan tracking-widest uppercase block mb-1">
                CURATED DEPARTMENTS // AUTUMN-WINTER 2026
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase text-black">
                THREE ATELIER SECTIONS
              </h2>
            </div>
            <p className="font-body text-xs text-charcoal max-w-sm">
              Explore bespoke architectural tailoring across dedicated menswear, sculptural womenswear, and junior atelier foundations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. MALE SECTION */}
            <div className="group relative bg-offwhite border-2 border-black flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
              <div className="p-6 border-b border-black flex items-center justify-between bg-black text-cream">
                <span className="font-display text-xs font-bold tracking-widest text-cyan uppercase">
                  SECTION 01
                </span>
                <span className="font-display text-sm font-bold tracking-widest uppercase">
                  MALE ARCHIVE
                </span>
              </div>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-grey/30">
                <Image
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"
                  alt="ATELIER 00 Male Menswear Collection"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-cream">
                  <span className="font-display text-[10px] tracking-widest text-cyan font-bold uppercase mb-1">
                    BOX CUTS & HEAVYWEIGHT FRENCH TERRY
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                    1. MALE
                  </h3>
                  <p className="font-body text-xs text-grey mt-1">
                    Geometric silhouettes, twin-needle dropped shoulder tees, and structured poplin shirts.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-offwhite flex items-center justify-between">
                <Link
                  href="/shop?gender=male"
                  className="w-full flex items-center justify-between font-display text-xs font-bold tracking-widest text-black bg-cyan py-3 px-4 border border-black hover:bg-black hover:text-cyan transition-colors uppercase"
                >
                  <span>EXPLORE MALE [5 PIECES]</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* 2. FEMALE SECTION */}
            <div className="group relative bg-offwhite border-2 border-black flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
              <div className="p-6 border-b border-black flex items-center justify-between bg-black text-cream">
                <span className="font-display text-xs font-bold tracking-widest text-cyan uppercase">
                  SECTION 02
                </span>
                <span className="font-display text-sm font-bold tracking-widest uppercase">
                  FEMALE ARCHIVE
                </span>
              </div>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-grey/30">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80"
                  alt="ATELIER 00 Female Womenswear Collection"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-cream">
                  <span className="font-display text-[10px] tracking-widest text-cyan font-bold uppercase mb-1">
                    SCULPTURAL DRAPE & BIAS-CUT SILK
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                    2. FEMALE
                  </h3>
                  <p className="font-body text-xs text-grey mt-1">
                    Virgin wool cocoon coats, sandwashed mulberry silk blouses, and high-rise palazzo fluid lines.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-offwhite flex items-center justify-between">
                <Link
                  href="/shop?gender=female"
                  className="w-full flex items-center justify-between font-display text-xs font-bold tracking-widest text-black bg-cyan py-3 px-4 border border-black hover:bg-black hover:text-cyan transition-colors uppercase"
                >
                  <span>EXPLORE FEMALE [3 PIECES]</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* 3. KIDS SECTION */}
            <div className="group relative bg-offwhite border-2 border-black flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
              <div className="p-6 border-b border-black flex items-center justify-between bg-black text-cream">
                <span className="font-display text-xs font-bold tracking-widest text-cyan uppercase">
                  SECTION 03
                </span>
                <span className="font-display text-sm font-bold tracking-widest uppercase">
                  KIDS ARCHIVE
                </span>
              </div>
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-grey/30">
                <Image
                  src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"
                  alt="ATELIER 00 Kids Junior Collection"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-cream">
                  <span className="font-display text-[10px] tracking-widest text-cyan font-bold uppercase mb-1">
                    DURABLE RIPSTOP & GOTS ORGANIC COTTON
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                    3. KIDS
                  </h3>
                  <p className="font-body text-xs text-grey mt-1">
                    Junior box tees, cozy loopback French Terry hoodies, and modular reinforced cargo pants.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-offwhite flex items-center justify-between">
                <Link
                  href="/shop?gender=kids"
                  className="w-full flex items-center justify-between font-display text-xs font-bold tracking-widest text-black bg-cyan py-3 px-4 border border-black hover:bg-black hover:text-cyan transition-colors uppercase"
                >
                  <span>EXPLORE KIDS [3 PIECES]</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION (PRD §6.1 HOME-3) */}
      <section className="py-20 px-6 md:px-12 border-b border-black bg-offwhite">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex items-end justify-between border-b border-black pb-4">
            <div>
              <span className="font-display text-xs font-bold text-cyan tracking-widest uppercase block mb-1">
                CURATED SELECTION
              </span>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight uppercase text-black">
                FEATURED PRODUCTS
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-display text-xs font-bold tracking-widest uppercase text-black hover:text-cyan underline"
            >
              VIEW ENTIRE ARCHIVE →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* HORIZONTAL COLLECTION STRIP (PRD §6.1 HOME-4) */}
      <section className="py-20 px-6 md:px-12 border-b border-black bg-cream">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex items-end justify-between border-b border-grey pb-4">
            <div>
              <span className="font-display text-xs font-bold text-charcoal tracking-widest uppercase block mb-1">
                CURATED EDITIONS
              </span>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight uppercase text-black">
                COLLECTION STRIP
              </h2>
            </div>

            {/* Scroll Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCollection('left')}
                aria-label="Scroll collections left"
                className="p-2 border border-black bg-offwhite hover:bg-cyan text-black transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCollection('right')}
                aria-label="Scroll collections right"
                className="p-2 border border-black bg-offwhite hover:bg-cyan text-black transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Draggable & Scrollable Strip */}
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
                className="snap-start flex-shrink-0 w-80 md:w-96 bg-offwhite border border-black p-6 flex flex-col justify-between h-64 group hover:border-black hover:bg-cyan/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-xs font-bold tracking-widest text-charcoal uppercase">
                    COLLECTION // 0{col.display_order}
                  </span>
                  <span className="font-display text-xs font-bold text-black group-hover:translate-x-1 transition-transform">
                    ➔
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight uppercase text-black group-hover:text-cyan">
                    {col.name}
                  </h3>
                  <p className="font-body text-xs text-charcoal mt-2 line-clamp-2">
                    {col.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS CATALOG GRID */}
      <section className="py-20 px-6 md:px-12 bg-offwhite">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex items-end justify-between border-b border-black pb-4">
            <div>
              <span className="font-display text-xs font-bold text-cyan tracking-widest uppercase block mb-1">
                FULL DROP
              </span>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight uppercase text-black">
                NEW ARRIVALS
              </h2>
            </div>
            <Link href="/shop" className="font-display text-xs font-bold text-black hover:text-cyan uppercase underline">
              EXPLORE ALL ({newArrivals.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
