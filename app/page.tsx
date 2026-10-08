import React from 'react';
import type { Metadata } from 'next';
import { getProducts, getCollections } from '@/lib/db';
import { CinematicHomePage } from '@/components/home/CinematicHomePage';
import { CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: `${CONFIG.brandName} | Built for the Next Generation`,
  description: 'ZIPUP NATION — Premium streetwear movement. Built for the next generation. Monolithic cuts, heavyweight 450 GSM cotton, and sculptural street architecture.',
  openGraph: {
    title: `${CONFIG.brandName} | Built for the Next Generation`,
    description: 'ZIPUP NATION — Premium streetwear movement. Built for the next generation.',
    type: 'website',
  },
};

export default async function HomePage() {
  // Load real catalog data from existing data layer
  const [{ products: allProducts }, collections] = await Promise.all([
    getProducts({ limit: 24, sortBy: 'recommended' }),
    getCollections(),
  ]);

  // Featured 4-8 products and New Arrivals
  const featuredProducts = allProducts.slice(0, 8);
  const newArrivals = [...allProducts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <CinematicHomePage
      featuredProducts={featuredProducts}
      newArrivals={newArrivals}
      collections={collections}
    />
  );
}
