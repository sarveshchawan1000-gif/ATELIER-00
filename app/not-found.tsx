'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-cream">
      <div className="max-w-md flex flex-col items-center gap-6">
        <span className="font-display text-7xl font-bold tracking-tighter text-black">
          404
        </span>

        <div className="h-1 w-24 bg-cyan my-2 animate-pulse" />

        <h1 className="font-display text-xl md:text-2xl font-bold tracking-widest text-black uppercase">
          YOU WANDERED OFF THE RACK.
        </h1>

        <p className="font-body text-xs text-charcoal max-w-sm leading-relaxed">
          The garment or exhibition page you are seeking has been archived or does not exist in this collection.
        </p>

        <Link href="/" className="mt-4 w-full">
          <Button variant="primary" fullWidth size="lg">
            RETURN HOME
          </Button>
        </Link>
      </div>
    </main>
  );
}
