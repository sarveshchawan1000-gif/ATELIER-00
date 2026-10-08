'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export interface StatementSectionProps {
  statementLine1Ref?: React.RefObject<HTMLSpanElement | null>;
  statementLine2Ref?: React.RefObject<HTMLSpanElement | null>;
  statementLine3Ref?: React.RefObject<HTMLSpanElement | null>;
}

export function StatementSection({
  statementLine1Ref,
  statementLine2Ref,
  statementLine3Ref,
}: StatementSectionProps) {
  return (
    <section
      className="relative w-full py-24 md:py-36 bg-cream px-6 md:px-12 select-none overflow-hidden"
      aria-label="ZIPUP NATION Movement Statement"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-16">
        {/* 3-line statement */}
        <div className="flex flex-col font-display font-semibold uppercase tracking-tight text-black leading-[0.88] text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
          <div className="overflow-hidden py-1">
            <span
              ref={statementLine1Ref}
              className="inline-block will-change-transform"
            >
              Wear
            </span>
          </div>
          <div className="overflow-hidden py-1">
            <span
              ref={statementLine2Ref}
              className="inline-block text-charcoal will-change-transform"
            >
              The
            </span>
          </div>
          <div className="overflow-hidden py-1">
            <span
              ref={statementLine3Ref}
              className="inline-block text-black will-change-transform"
            >
              Movement.
            </span>
          </div>
        </div>

        {/* Editorial Subtext */}
        <div className="max-w-md flex flex-col gap-6">
          <div className="border-l border-grey pl-5 py-1">
            <p className="font-body text-base md:text-lg text-charcoal leading-relaxed">
              We don&apos;t engineer disposable garments. We forge heavyweight streetwear with 450 GSM French terry cotton, reinforced seams, and sculptural geometry.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/about">
              <Button
                variant="secondary"
                size="md"
                className="border border-black/15 font-display font-medium uppercase tracking-wider text-black hover:bg-black hover:text-cream transition-all"
              >
                Read Manifesto <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
