'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
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
    <footer className="bg-cream text-black border-t border-grey/40 pt-16 pb-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-grey/30">
        {/* Brand & Newsletter Column */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight text-black uppercase flex items-center gap-1">
            <span>{CONFIG.brandHalves.left}</span>
            <span className="text-charcoal">{CONFIG.brandHalves.right}</span>
          </Link>
          <p className="font-body text-sm text-charcoal max-w-sm leading-relaxed">
            Built for the next generation. Heavyweight silhouettes, monolithic cuts, and structural street architecture.
          </p>

          {/* Newsletter Form */}
          <div className="mt-2 max-w-md">
            <span className="font-body text-xs font-medium uppercase tracking-wider text-charcoal block mb-2">
              Join the drop list
            </span>
            {submitted ? (
              <p className="text-sm text-black font-medium">
                ✓ You&apos;re on the list.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <div className="flex items-center gap-3 border-b border-grey pb-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm font-body text-black placeholder:text-charcoal/50 focus:outline-none py-1"
                  />
                  <button
                    type="submit"
                    className="font-body text-sm font-medium text-black hover:text-charcoal transition-colors py-1 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
                  >
                    Join →
                  </button>
                </div>
                <Checkbox
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  label={
                    <span className="text-[11px] text-charcoal">
                      I agree to receive updates per the{' '}
                      <Link href="/privacy" className="underline hover:text-black">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  }
                />
                {error && <p className="text-xs text-error font-medium">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8 font-body">
          {/* Shop */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-medium tracking-wider uppercase text-black">Shop</h4>
            <ul className="flex flex-col gap-2 text-sm text-charcoal">
              <li>
                <Link href="/shop?gender=male" className="hover:text-black transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/shop?gender=female" className="hover:text-black transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/shop?gender=kids" className="hover:text-black transition-colors">
                  Kids
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-black transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-black transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Movement */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-medium tracking-wider uppercase text-black">Movement</h4>
            <ul className="flex flex-col gap-2 text-sm text-charcoal">
              <li>
                <Link href="/collections" className="hover:text-black transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-medium tracking-wider uppercase text-black">Help</h4>
            <ul className="flex flex-col gap-2 text-sm text-charcoal">
              <li>
                <Link href="/shipping" className="hover:text-black transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-black transition-colors">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-black transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-medium tracking-wider uppercase text-black">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm text-charcoal">
              <li>
                <Link href="/privacy" className="hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-charcoal">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <p>© 2026 {CONFIG.brandName}. All rights reserved.</p>
          <p>{CONFIG.taxes.gstInclusiveNote}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <Link href="/account/orders/BRD-2026-981245" className="hover:text-black transition-colors">
            Track Order
          </Link>
          <span className="text-grey">·</span>
          <Link href="/admin" className="hover:text-black transition-colors">
            Studio
          </Link>
          <span className="text-grey">·</span>
          <Link href="/dev/styleguide" className="hover:text-black transition-colors">
            Styleguide
          </Link>
        </div>
      </div>
    </footer>
  );
}
