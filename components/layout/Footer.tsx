'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';

export function Footer() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please check the consent box to subscribe.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <footer className="bg-black text-cream border-t border-black pt-16 pb-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-charcoal/40">
        {/* Brand & Newsletter Column */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <h2 className="font-display text-4xl font-bold tracking-tighter uppercase text-cream">
            {CONFIG.brandName}
          </h2>
          <p className="font-body text-xs text-grey max-w-md leading-relaxed">
            A luxury digital fashion showroom curated in India. Architectural garment engineering meets high-contrast editorial curation.
          </p>

          {/* Newsletter Form */}
          <div className="mt-2 bg-charcoal/20 border border-charcoal/60 p-5">
            <h3 className="font-display text-xs font-bold tracking-widest text-cyan uppercase mb-2">
              EXHIBITION EDITIONS NEWSLETTER
            </h3>
            {submitted ? (
              <p className="font-body text-xs text-cyan">
                ✓ Thank you. You are subscribed to upcoming collection drops.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black text-cream border-charcoal text-xs placeholder:text-grey/60"
                  />
                  <Button type="submit" variant="primary" size="sm" className="bg-cyan text-black hover:bg-cream">
                    JOIN
                  </Button>
                </div>
                <Checkbox
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  label={
                    <span className="text-[11px] text-grey">
                      I agree to receive transactional drop updates & editorial releases per the{' '}
                      <Link href="/privacy" className="underline hover:text-cyan">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  }
                />
                {error && <p className="text-xs text-error-red font-medium">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Shop */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-xs font-bold tracking-widest text-cyan uppercase">SHOP</h4>
            <ul className="flex flex-col gap-2 font-body text-xs text-grey">
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-cream transition-colors">
                  NEW ARRIVALS
                </Link>
              </li>
              <li>
                <Link href="/shop/t-shirts" className="hover:text-cream transition-colors">
                  T-SHIRTS & TOPS
                </Link>
              </li>
              <li>
                <Link href="/shop/shirts" className="hover:text-cream transition-colors">
                  SHIRTS
                </Link>
              </li>
              <li>
                <Link href="/shop/hoodies" className="hover:text-cream transition-colors">
                  HOODIES & SWEATS
                </Link>
              </li>
              <li>
                <Link href="/shop/jackets" className="hover:text-cream transition-colors">
                  JACKETS
                </Link>
              </li>
              <li>
                <Link href="/shop/bottoms" className="hover:text-cream transition-colors">
                  BOTTOMS
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-xs font-bold tracking-widest text-cyan uppercase">ABOUT</h4>
            <ul className="flex flex-col gap-2 font-body text-xs text-grey">
              <li>
                <Link href="/about" className="hover:text-cream transition-colors">
                  OUR STORY
                </Link>
              </li>
              <li>
                <Link href="/about#atelier" className="hover:text-cream transition-colors">
                  ATELIER
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cream transition-colors">
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-xs font-bold tracking-widest text-cyan uppercase">HELP</h4>
            <ul className="flex flex-col gap-2 font-body text-xs text-grey">
              <li>
                <Link href="/shipping" className="hover:text-cream transition-colors">
                  SHIPPING & DELIVERY
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-cream transition-colors">
                  RETURNS & REFUNDS
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cream transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-cream transition-colors">
                  SIZE GUIDE
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-xs font-bold tracking-widest text-cyan uppercase">LEGAL</h4>
            <ul className="flex flex-col gap-2 font-body text-xs text-grey">
              <li>
                <Link href="/privacy" className="hover:text-cream transition-colors">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cream transition-colors">
                  TERMS & CONDITIONS
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Metadata Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-display text-[11px] tracking-wider text-grey/80 uppercase">
        <p>© 2026 {CONFIG.brandName}. ALL RIGHTS RESERVED.</p>
        <p>{CONFIG.taxes.gstInclusiveNote} | {CONFIG.taxes.gstNumberPlaceholder}</p>
      </div>
    </footer>
  );
}
