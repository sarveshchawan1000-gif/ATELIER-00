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
      <nav className="flex-1 flex flex-col justify-center gap-4 my-6 overflow-y-auto">
        {/* The 3 Core Sections: MALE, FEMALE, KIDS */}
        <div className="flex flex-col gap-2 pb-4 border-b border-grey">
          <span className="font-display text-[10px] font-bold text-cyan tracking-widest uppercase">
            DEPARTMENTS // SECTIONS
          </span>
          <Link
            href="/shop?gender=male"
            onClick={onClose}
            className="font-display text-2xl font-bold tracking-tight text-black hover:text-cyan transition-colors uppercase flex items-center justify-between py-1"
          >
            <span>01 // MALE</span>
            <span className="text-cyan font-bold">→</span>
          </Link>
          <Link
            href="/shop?gender=female"
            onClick={onClose}
            className="font-display text-2xl font-bold tracking-tight text-black hover:text-cyan transition-colors uppercase flex items-center justify-between py-1"
          >
            <span>02 // FEMALE</span>
            <span className="text-cyan font-bold">→</span>
          </Link>
          <Link
            href="/shop?gender=kids"
            onClick={onClose}
            className="font-display text-2xl font-bold tracking-tight text-black hover:text-cyan transition-colors uppercase flex items-center justify-between py-1"
          >
            <span>03 // KIDS</span>
            <span className="text-cyan font-bold">→</span>
          </Link>
        </div>

        {/* Kinds of Cloth Sections */}
        <div className="flex flex-col gap-1.5 pb-4 border-b border-grey">
          <span className="font-display text-[10px] font-bold text-charcoal tracking-widest uppercase">
            KINDS OF CLOTH // CATEGORIES
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-display font-bold uppercase">
            <Link
              href="/shop/t-shirts"
              onClick={onClose}
              className="py-1.5 px-2 bg-offwhite border border-grey hover:border-black hover:text-cyan hover:bg-black transition-colors"
            >
              👕 TEES
            </Link>
            <Link
              href="/shop/shirts"
              onClick={onClose}
              className="py-1.5 px-2 bg-offwhite border border-grey hover:border-black hover:text-cyan hover:bg-black transition-colors"
            >
              👔 SHIRTS
            </Link>
            <Link
              href="/shop/hoodies"
              onClick={onClose}
              className="py-1.5 px-2 bg-offwhite border border-grey hover:border-black hover:text-cyan hover:bg-black transition-colors"
            >
              🧥 HOODIES
            </Link>
            <Link
              href="/shop/jackets"
              onClick={onClose}
              className="py-1.5 px-2 bg-offwhite border border-grey hover:border-black hover:text-cyan hover:bg-black transition-colors"
            >
              🧥 JACKETS
            </Link>
            <Link
              href="/shop/bottoms"
              onClick={onClose}
              className="col-span-2 py-1.5 px-2 bg-offwhite border border-grey hover:border-black hover:text-cyan hover:bg-black transition-colors text-center"
            >
              👖 BOTTOMS / PANTS
            </Link>
          </div>
        </div>

        <Link
          href="/shop"
          onClick={onClose}
          className="font-display text-lg font-bold tracking-tight text-charcoal hover:text-black transition-colors uppercase py-1"
        >
          ALL ARCHIVE CATALOGUE
        </Link>
        <Link
          href="/collections"
          onClick={onClose}
          className="font-display text-lg font-bold tracking-tight text-charcoal hover:text-black transition-colors uppercase py-1"
        >
          COLLECTIONS
        </Link>
        <Link
          href="/about"
          onClick={onClose}
          className="font-display text-lg font-bold tracking-tight text-charcoal hover:text-black transition-colors uppercase py-1"
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
