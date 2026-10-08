'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { X } from 'lucide-react';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();

        if (e.key === 'Tab' && menuRef.current) {
          const focusables = menuRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 bg-cream flex flex-col p-6 animate-in fade-in duration-200"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-grey/40 pb-4">
        <Link
          href="/"
          onClick={onClose}
          className="font-display text-lg font-semibold tracking-tight text-black uppercase flex items-center gap-1"
        >
          <span>{CONFIG.brandHalves.left}</span>
          <span className="text-charcoal">{CONFIG.brandHalves.right}</span>
        </Link>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 text-black hover:text-charcoal transition-colors focus-visible:outline-2 focus-visible:outline-black"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      {/* Main Links */}
      <nav className="flex-1 flex flex-col justify-start gap-6 my-6 overflow-y-auto pt-4 font-body">
        {/* Departments */}
        <div className="flex flex-col gap-3 pb-6 border-b border-grey/30">
          <span className="text-xs font-medium text-charcoal tracking-wider uppercase">
            Departments
          </span>
          <div className="flex flex-col gap-2 text-xl font-medium tracking-tight">
            <Link
              href="/shop?gender=male"
              onClick={onClose}
              className="text-black hover:text-charcoal transition-colors flex items-center justify-between py-1"
            >
              <span>Men</span>
              <span className="text-sm text-charcoal/40">→</span>
            </Link>
            <Link
              href="/shop?gender=female"
              onClick={onClose}
              className="text-black hover:text-charcoal transition-colors flex items-center justify-between py-1"
            >
              <span>Women</span>
              <span className="text-sm text-charcoal/40">→</span>
            </Link>
            <Link
              href="/shop?gender=kids"
              onClick={onClose}
              className="text-black hover:text-charcoal transition-colors flex items-center justify-between py-1"
            >
              <span>Kids</span>
              <span className="text-sm text-charcoal/40">→</span>
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-3 pb-6 border-b border-grey/30">
          <span className="text-xs font-medium text-charcoal tracking-wider uppercase">
            Categories
          </span>
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link
              href="/shop/t-shirts"
              onClick={onClose}
              className="py-2.5 px-3 bg-offwhite border border-grey/40 text-black hover:border-black/20 transition-colors rounded-sm"
            >
              Tees
            </Link>
            <Link
              href="/shop/shirts"
              onClick={onClose}
              className="py-2.5 px-3 bg-offwhite border border-grey/40 text-black hover:border-black/20 transition-colors rounded-sm"
            >
              Shirts
            </Link>
            <Link
              href="/shop/hoodies"
              onClick={onClose}
              className="py-2.5 px-3 bg-offwhite border border-grey/40 text-black hover:border-black/20 transition-colors rounded-sm"
            >
              Hoodies
            </Link>
            <Link
              href="/shop/jackets"
              onClick={onClose}
              className="py-2.5 px-3 bg-offwhite border border-grey/40 text-black hover:border-black/20 transition-colors rounded-sm"
            >
              Jackets
            </Link>
            <Link
              href="/shop/bottoms"
              onClick={onClose}
              className="col-span-2 py-2.5 px-3 bg-offwhite border border-grey/40 text-black hover:border-black/20 transition-colors text-center rounded-sm"
            >
              Bottoms
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-lg font-medium tracking-tight">
          <Link
            href="/shop"
            onClick={onClose}
            className="text-black hover:text-charcoal transition-colors py-1"
          >
            All Products
          </Link>
          <Link
            href="/collections"
            onClick={onClose}
            className="text-black hover:text-charcoal transition-colors py-1"
          >
            Collections
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="text-black hover:text-charcoal transition-colors py-1"
          >
            About
          </Link>
        </div>
      </nav>

      {/* Bottom Utility */}
      <div className="pt-4 border-t border-grey/30 flex flex-wrap items-center justify-between gap-4 text-sm text-charcoal">
        <Link href="/account" onClick={onClose} className="hover:text-black transition-colors">
          My Account
        </Link>
        <Link href="/wishlist" onClick={onClose} className="hover:text-black transition-colors">
          Wishlist
        </Link>
        <Link href="/account/orders/BRD-2026-981245" onClick={onClose} className="hover:text-black transition-colors">
          Track Order
        </Link>
        <Link href="/admin" onClick={onClose} className="hover:text-black transition-colors">
          Admin
        </Link>
      </div>
    </div>
  );
}
