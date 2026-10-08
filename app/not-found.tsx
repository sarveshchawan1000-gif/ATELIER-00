'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-cream text-black">
      <div className="max-w-md flex flex-col items-center gap-5">
        <span className="font-display text-7xl font-semibold tracking-tight text-black">
          404
        </span>

        <h1 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-black">
          Page Not Found
        </h1>

        <p className="font-body text-xs md:text-sm text-charcoal max-w-sm leading-relaxed">
          The piece or archive you are looking for has been relocated or is no longer available.
        </p>

        <Link href="/" className="mt-4">
          <Button variant="primary" size="lg" className="bg-black text-white hover:bg-charcoal rounded-sm font-medium px-8">
            Return Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
