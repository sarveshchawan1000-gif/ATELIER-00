'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';

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
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 bg-cream flex flex-col p-6 animate-in fade-in duration-200"
    >
      {/* Top Header Row in Menu */}
      <div className="flex items-center justify-between border-b border-grey pb-4">
        <Link
          href="/"
          onClick={onClose}
          className="font-display text-lg font-bold tracking-widest text-black uppercase"
        >
          {CONFIG.brandName}
        </Link>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="p-2.5 text-black hover:bg-cyan hover:text-black font-bold text-base transition-colors border border-black"
        >
          ✕ CLOSE
        </button>
      </div>

      {/* Main Links List */}
      <nav className="flex-1 flex flex-col justify-center gap-6 my-8">
        <Link
          href="/shop"
          onClick={onClose}
          className="font-display text-3xl font-bold tracking-tight text-black hover:text-cyan transition-colors uppercase border-b border-grey/30 pb-2"
        >
          SHOP
        </Link>

        {/* Categories Nested */}
        <div className="flex flex-col gap-2 pl-4 border-l-2 border-black/20 my-1">
          <Link
            href="/shop/t-shirts"
            onClick={onClose}
            className="font-display text-sm text-charcoal hover:text-black uppercase tracking-wider"
          >
            T-SHIRTS & TOPS
          </Link>
          <Link
            href="/shop/shirts"
            onClick={onClose}
            className="font-display text-sm text-charcoal hover:text-black uppercase tracking-wider"
          >
            SHIRTS
          </Link>
          <Link
            href="/shop/hoodies"
            onClick={onClose}
            className="font-display text-sm text-charcoal hover:text-black uppercase tracking-wider"
          >
            HOODIES & SWEATS
          </Link>
          <Link
            href="/shop/jackets"
            onClick={onClose}
            className="font-display text-sm text-charcoal hover:text-black uppercase tracking-wider"
          >
            JACKETS & OUTERWEAR
          </Link>
          <Link
            href="/shop/bottoms"
            onClick={onClose}
            className="font-display text-sm text-charcoal hover:text-black uppercase tracking-wider"
          >
            BOTTOMS
          </Link>
        </div>

        <Link
          href="/collections"
          onClick={onClose}
          className="font-display text-3xl font-bold tracking-tight text-black hover:text-cyan transition-colors uppercase border-b border-grey/30 pb-2"
        >
          COLLECTIONS
        </Link>

        <Link
          href="/about"
          onClick={onClose}
          className="font-display text-3xl font-bold tracking-tight text-black hover:text-cyan transition-colors uppercase border-b border-grey/30 pb-2"
        >
          ABOUT ATELIER
        </Link>
      </nav>

      {/* Bottom Utility Links */}
      <div className="pt-6 border-t border-grey flex flex-wrap items-center justify-between gap-3 font-display text-xs tracking-widest text-charcoal uppercase">
        <Link href="/account" onClick={onClose} className="hover:text-black underline">
          MY ACCOUNT
        </Link>
        <Link href="/wishlist" onClick={onClose} className="hover:text-black underline">
          WISHLIST
        </Link>
        <Link href="/account/orders/BRD-2026-981245" onClick={onClose} className="hover:text-black underline">
          TRACK ORDER
        </Link>
        <Link href="/admin" onClick={onClose} className="text-cyan font-bold hover:underline">
          ADMIN
        </Link>
      </div>
    </div>
  );
}
