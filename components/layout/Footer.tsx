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
    <footer className="bg-[#FAFAF8] text-[#111111] border-t border-[#E8E6E1] pt-16 pb-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-[#E8E6E1]">
        {/* Brand & Newsletter Column */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <Link href="/" className="text-xl font-medium tracking-[0.04em] text-[#111111]">
            {CONFIG.brandName}
          </Link>
          <p className="text-xs md:text-sm text-[#6B6B6B] max-w-sm leading-relaxed">
            Minimal, architectural garments engineered with pure materials and refined silhouettes.
          </p>

          {/* Minimal Newsletter Form with underline-only field */}
          <div className="mt-2 max-w-md">
            <span className="text-[13px] font-medium text-[#111111] block mb-2">
              Newsletter
            </span>
            {submitted ? (
              <p className="text-xs text-[#111111]">
                ✓ Thank you. You are subscribed to upcoming collection drops.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <div className="flex items-center gap-3 border-b border-[#111111] pb-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#111111] placeholder:text-[#6B6B6B] focus:outline-none py-1"
                  />
                  <button
                    type="submit"
                    className="text-xs font-medium text-[#111111] hover:text-[#6B6B6B] transition-colors uppercase tracking-wider py-1 shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
                <Checkbox
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  label={
                    <span className="text-[11px] text-[#6B6B6B]">
                      I agree to receive collection drop updates per the{' '}
                      <Link href="/privacy" className="underline hover:text-[#111111]">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  }
                />
                {error && <p className="text-xs text-error-red">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Links Grid: 4 Tidy Columns */}
        <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Shop */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[13px] font-medium text-[#111111]">Shop</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#6B6B6B]">
              <li>
                <Link href="/shop?gender=male" className="hover:text-[#111111] transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/shop?gender=female" className="hover:text-[#111111] transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/shop?gender=kids" className="hover:text-[#111111] transition-colors">
                  Kids
                </Link>
              </li>
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-[#111111] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#111111] transition-colors">
                  All Garments
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[13px] font-medium text-[#111111]">About</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#6B6B6B]">
              <li>
                <Link href="/about" className="hover:text-[#111111] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about#atelier" className="hover:text-[#111111] transition-colors">
                  Atelier
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#111111] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[13px] font-medium text-[#111111]">Help</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#6B6B6B]">
              <li>
                <Link href="/shipping" className="hover:text-[#111111] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#111111] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#111111] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-[#111111] transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[13px] font-medium text-[#111111]">Legal</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#6B6B6B]">
              <li>
                <Link href="/privacy" className="hover:text-[#111111] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#111111] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Metadata Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B6B6B]">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <p>© 2026 {CONFIG.brandName}. All rights reserved.</p>
          <p>{CONFIG.taxes.gstInclusiveNote}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/account/orders/BRD-2026-981245" className="hover:text-[#111111] hover:underline">
            Track Order
          </Link>
          <span className="text-[#E8E6E1]">/</span>
          <Link href="/admin" className="hover:text-[#111111] hover:underline">
            Console
          </Link>
          <span className="text-[#E8E6E1]">/</span>
          <Link href="/dev/styleguide" className="hover:text-[#111111] hover:underline">
            Styleguide
          </Link>
        </div>
      </div>
    </footer>
  );
}
