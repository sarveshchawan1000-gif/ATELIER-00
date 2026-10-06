import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections, getProducts } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Exhibition Collections',
  description: 'Curated architectural fashion collections and monographic garment drops.',
};

// Curated collection preview imagery
const COLLECTION_IMAGES: Record<string, string> = {
  'new-arrivals': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80',
  'best-sellers': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80',
  'heavy-hoodies': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80',
  'technical-outerwear': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1000&auto=format&fit=crop&q=80',
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  const { products } = await getProducts({ limit: 100 });

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b-2 border-black pb-8">
          <span className="font-display text-xs tracking-widest text-cyan uppercase bg-black px-2.5 py-1 inline-block mb-3">
            CURATED ARCHIVES
          </span>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase text-black">
            EXHIBITION COLLECTIONS
          </h1>
          <p className="font-body text-sm md:text-base text-charcoal max-w-2xl mt-4">
            Thematic monographs organized around sculptural silhouettes, heavy French Terry weights, 
            and weatherproof outerwear architecture.
          </p>
        </div>

        {/* Collections Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {collections.map((col, idx) => {
            const itemCount = products.filter((p) =>
              p.collections.some((c) => c.slug === col.slug)
            ).length;
            const imageUrl =
              COLLECTION_IMAGES[col.slug] ||
              'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80';

            return (
              <article
                key={col.id}
                className="group bg-offwhite border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_#111111] hover:shadow-[10px_10px_0px_0px_#111111] transition-all flex flex-col justify-between"
              >
                {/* Lookbook Image Container */}
                <Link
                  href={`/shop?collection=${encodeURIComponent(col.slug)}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-black"
                >
                  <Image
                    src={imageUrl}
                    alt={col.name}
                    fill
                    className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 bg-black text-cyan px-2.5 py-1 font-display text-[10px] font-bold tracking-widest uppercase">
                    SERIES 0{idx + 1} // [{itemCount.toString().padStart(2, '0')} ARTIFACTS]
                  </div>
                </Link>

                {/* Details */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1 gap-6 border-t-2 border-black">
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase group-hover:text-cyan transition-colors">
                      <Link href={`/shop?collection=${encodeURIComponent(col.slug)}`}>
                        {col.name}
                      </Link>
                    </h2>
                    <p className="font-body text-xs md:text-sm text-charcoal leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-grey flex items-center justify-between">
                    <span className="font-display text-xs font-bold uppercase text-charcoal tracking-wider">
                      CATALOG ARCHIVE
                    </span>
                    <Link href={`/shop?collection=${encodeURIComponent(col.slug)}`}>
                      <Button variant="primary" size="sm">
                        VIEW COLLECTION <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
