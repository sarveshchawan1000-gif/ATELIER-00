import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Ruler, Layers, BadgeCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Movement Manifesto',
  description: 'ZIPUP NATION — We do not follow the movement. We build it. Premium streetwear built for the next generation.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream text-black">
      {/* 1. Hero Section */}
      <section className="pt-24 md:pt-36 pb-16 md:pb-20 px-6 max-w-[1280px] mx-auto">
        <div className="max-w-3xl">
          <span className="font-display text-xs font-bold tracking-widest text-charcoal uppercase block mb-4">
            MOVEMENT MANIFESTO
          </span>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase leading-[1.05] text-black">
            BUILT FOR THE NEXT GENERATION.
          </h1>
          <p className="font-body text-base md:text-lg text-charcoal max-w-[560px] leading-relaxed mt-6">
            ZIPUP NATION is a premium streetwear movement. We don’t follow the movement. We build it. Every garment is engineered with monolithic cuts, heavyweight textiles, and uncompromising street architecture.
          </p>
        </div>
      </section>

      {/* 2. Full-Width Editorial Image */}
      <section id="atelier" className="px-6 max-w-[1280px] mx-auto pb-16 md:pb-24">
        <div className="relative w-full aspect-[4/5] md:aspect-[16/9] bg-[#F3F2EF] rounded-[2px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&auto=format&fit=crop&q=85"
            alt="Pattern cutters and master tailors refining seams in our Mumbai studio"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
        <p className="mt-3 text-[13px] text-[#6B6B6B] leading-relaxed">
          Pattern cutters and master tailors refining seams in our Mumbai studio.
        </p>
      </section>

      {/* 3. Two Story Sections */}
      <section className="px-6 max-w-[1280px] mx-auto border-t border-[#E8E6E1]">
        {/* Story Section 1 */}
        <div className="py-16 md:py-20 border-b border-[#E8E6E1] grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
          <div className="md:col-span-5">
            <h2 className="text-[24px] md:text-[28px] font-medium text-[#111111] leading-tight tracking-[-0.01em]">
              Made to last, not to be replaced
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-[16px] text-[#444444] max-w-[560px] leading-[1.7]">
              We design for longevity. Our garments use 320-450 GSM fabrics, double-faced French terry and reinforced stitching, so they hold their shape season after season.
            </p>
          </div>
        </div>

        {/* Story Section 2 */}
        <div className="py-16 md:py-20 border-b border-[#E8E6E1] grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start">
          <div className="md:col-span-5">
            <h2 className="text-[24px] md:text-[28px] font-medium text-[#111111] leading-tight tracking-[-0.01em]">
              Woven and assembled in India
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-[16px] text-[#444444] max-w-[560px] leading-[1.7]">
              We work with cotton spinners in Tamil Nadu and master tailoring units in Maharashtra, paying fair, living wages and tracing every garment from fibre to finished piece.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Values Section */}
      <section className="px-6 max-w-[1280px] mx-auto py-16 md:py-24">
        <h2 className="text-[28px] md:text-[32px] font-medium text-[#111111] tracking-[-0.01em] mb-12 md:mb-16">
          What we stand for
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Pillar 1 */}
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 flex items-center justify-start text-[#111111]">
              <Ruler className="w-6 h-6 text-[#111111]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-medium text-[#111111]">
              Precise fit
            </h3>
            <p className="text-[14px] md:text-[15px] text-[#6B6B6B] leading-relaxed max-w-[320px]">
              Clean lines and relaxed drop shoulders cut to drape comfortably on every body.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 flex items-center justify-start text-[#111111]">
              <Layers className="w-6 h-6 text-[#111111]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-medium text-[#111111]">
              Substantial fabrics
            </h3>
            <p className="text-[14px] md:text-[15px] text-[#6B6B6B] leading-relaxed max-w-[320px]">
              Dense, high-quality cotton and wool with real weight, structure and comfort.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 flex items-center justify-start text-[#111111]">
              <BadgeCheck className="w-6 h-6 text-[#111111]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-medium text-[#111111]">
              Small batches
            </h3>
            <p className="text-[14px] md:text-[15px] text-[#6B6B6B] leading-relaxed max-w-[320px]">
              Limited, serial-numbered runs that reduce overproduction and keep each piece special.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="bg-[#F3F2EF] py-20 md:py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[28px] font-medium text-[#111111] tracking-[-0.01em]">
            Explore the collection
          </h2>
          <p className="text-[15px] text-[#6B6B6B] mt-3 mb-8">
            Thoughtfully made pieces, available across India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[160px]">
                Shop all
              </Button>
            </Link>
            <Link href="/collections/new-arrivals" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[180px]">
                Shop new arrivals
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
