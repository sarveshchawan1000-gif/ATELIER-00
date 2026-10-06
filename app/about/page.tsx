import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Compass, Shield, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | Monograph & Atelier',
  description: 'Architectural garment engineering meets high-contrast editorial curation.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-20 md:space-y-32">
        {/* Monograph Header */}
        <section className="border-b-2 border-black pb-12 md:pb-20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-xs tracking-widest text-cyan uppercase bg-black px-2.5 py-1">
                MONOGRAPH 004
              </span>
              <span className="font-display text-xs tracking-widest text-charcoal uppercase">
                ESTABLISHED 2026 // INDIA
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter uppercase text-black max-w-5xl leading-[0.9]">
              ARCHITECTURAL FORM. UNCOMPROMISING DRAPE.
            </h1>
          </div>
          <p className="font-body text-base md:text-xl text-charcoal max-w-3xl mt-8 leading-relaxed">
            {CONFIG.brandName} operates at the nexus of brutalist spatial geometry and artisanal Indian textile engineering.
            Every artifact is designed as a wearable monolith—sculpted with structural weight, refined drop shoulders, and 
            intentional permanence.
          </p>
        </section>

        {/* Narrative Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative aspect-[4/5] bg-offwhite border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_#111111]">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=85"
              alt="Atelier drape craftsmanship"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/90 p-4 border border-grey/30">
              <span className="font-display text-xs tracking-widest text-cyan uppercase block mb-1">
                STUDIO DISPATCH // ATELIER
              </span>
              <p className="font-body text-xs text-cream">
                Pattern cutters and master tailors refining structural seams in our Mumbai design chamber.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="font-display text-xs font-bold tracking-widest text-cyan uppercase">
                01 // THE MANIFESTO
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
                REJECTING SEASONAL DISPOSABILITY
              </h2>
              <p className="font-body text-sm md:text-base text-charcoal leading-relaxed">
                Conventional fashion demands obsolescence. We engineer our garments with 320 to 450 GSM weights,
                double-faced French Terry weaves, and reinforced bar-tacks to withstand decades, not seasons.
              </p>
            </div>

            <div className="space-y-4">
              <span className="font-display text-xs font-bold tracking-widest text-cyan uppercase">
                02 // DOMESTIC PROVENANCE
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
                WOVEN AND ASSEMBLED IN INDIA
              </h2>
              <p className="font-body text-sm md:text-base text-charcoal leading-relaxed">
                India possesses an unrivaled heritage of cotton spinning and bespoke tailoring. We collaborate
                exclusively with ethical certified spinning facilities in Tamil Nadu and master stitching units
                in Maharashtra, ensuring full living-wage compensation and traceability from seed to garment.
              </p>
            </div>
          </div>
        </section>

        {/* 3 Pillars Grid */}
        <section className="bg-offwhite border-2 border-black p-8 md:p-16">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="font-display text-xs font-bold tracking-widest text-cyan uppercase mb-2 block">
              CORE PRINCIPLES
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
              THE THREE FOUNDATIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-grey">
            <div className="pt-6 md:pt-0 md:px-6 space-y-4">
              <div className="w-12 h-12 bg-black text-cyan flex items-center justify-center font-display font-bold text-lg">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold tracking-wider uppercase">
                GEOMETRIC PRECISION
              </h3>
              <p className="font-body text-xs md:text-sm text-charcoal leading-relaxed">
                Patterns drafted with clean brutalist lines. Exaggerated drop-shoulders and boxy torsos designed
                to drape effortlessly regardless of body type.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:px-6 space-y-4">
              <div className="w-12 h-12 bg-black text-cyan flex items-center justify-center font-display font-bold text-lg">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold tracking-wider uppercase">
                TACTILE HEAVYWEIGHTS
              </h3>
              <p className="font-body text-xs md:text-sm text-charcoal leading-relaxed">
                We never compromise on fabric density. Our 100% organic cotton fabrics possess substantial heft
                that hangs with sculptural rigidity and feels remarkably comfortable.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:px-6 space-y-4">
              <div className="w-12 h-12 bg-black text-cyan flex items-center justify-center font-display font-bold text-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold tracking-wider uppercase">
                LIMITED MONOGRAPHS
              </h3>
              <p className="font-body text-xs md:text-sm text-charcoal leading-relaxed">
                Releases are produced in strictly quantified limited runs. Each piece is serial-tracked to eliminate
                overproduction and ensure collector value.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-black text-cream p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-black">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight uppercase text-cream">
              EXPLORE MONOGRAPH 004 PIECES
            </h2>
            <p className="font-body text-sm text-grey">
              Curated architectural garments currently available for dispatch across India.
            </p>
          </div>
          <Link href="/shop" className="w-full md:w-auto">
            <Button variant="primary" size="lg" className="w-full bg-cyan text-black hover:bg-cream">
              ENTER EXHIBITION <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
