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
      className="fixed inset-0 z-50 bg-[#FAFAF8] flex flex-col p-6 animate-in fade-in duration-200"
    >
      {/* Top Header Row in Menu */}
      <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-4">
        <Link
          href="/"
          onClick={onClose}
          className="text-lg font-medium tracking-[0.04em] text-[#111111]"
        >
          {CONFIG.brandName}
        </Link>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 text-[#111111] hover:text-[#6B6B6B] transition-colors"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      {/* Main Links List */}
      <nav className="flex-1 flex flex-col justify-start gap-6 my-6 overflow-y-auto pt-4">
        {/* The 3 Core Sections: Men, Women, Kids */}
        <div className="flex flex-col gap-3 pb-6 border-b border-[#E8E6E1]">
          <span className="text-[12px] font-medium text-[#6B6B6B] tracking-[0.04em]">
            Departments
          </span>
          <div className="flex flex-col gap-2">
            <Link
              href="/shop?gender=male"
              onClick={onClose}
              className="text-xl font-normal text-[#111111] hover:text-[#6B6B6B] transition-colors flex items-center justify-between py-1"
            >
              <span>Men</span>
              <span className="text-sm text-[#6B6B6B]">→</span>
            </Link>
            <Link
              href="/shop?gender=female"
              onClick={onClose}
              className="text-xl font-normal text-[#111111] hover:text-[#6B6B6B] transition-colors flex items-center justify-between py-1"
            >
              <span>Women</span>
              <span className="text-sm text-[#6B6B6B]">→</span>
            </Link>
            <Link
              href="/shop?gender=kids"
              onClick={onClose}
              className="text-xl font-normal text-[#111111] hover:text-[#6B6B6B] transition-colors flex items-center justify-between py-1"
            >
              <span>Kids</span>
              <span className="text-sm text-[#6B6B6B]">→</span>
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-3 pb-6 border-b border-[#E8E6E1]">
          <span className="text-[12px] font-medium text-[#6B6B6B] tracking-[0.04em]">
            Categories
          </span>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              href="/shop/t-shirts"
              onClick={onClose}
              className="py-2 px-3 bg-[#F3F2EF] text-[#111111] hover:bg-[#E8E6E1] transition-colors rounded-none"
            >
              Tees & Basics
            </Link>
            <Link
              href="/shop/shirts"
              onClick={onClose}
              className="py-2 px-3 bg-[#F3F2EF] text-[#111111] hover:bg-[#E8E6E1] transition-colors rounded-none"
            >
              Tailored Shirts
            </Link>
            <Link
              href="/shop/hoodies"
              onClick={onClose}
              className="py-2 px-3 bg-[#F3F2EF] text-[#111111] hover:bg-[#E8E6E1] transition-colors rounded-none"
            >
              Hoodies & Fleece
            </Link>
            <Link
              href="/shop/jackets"
              onClick={onClose}
              className="py-2 px-3 bg-[#F3F2EF] text-[#111111] hover:bg-[#E8E6E1] transition-colors rounded-none"
            >
              Outerwear
            </Link>
            <Link
              href="/shop/bottoms"
              onClick={onClose}
              className="col-span-2 py-2 px-3 bg-[#F3F2EF] text-[#111111] hover:bg-[#E8E6E1] transition-colors text-center rounded-none"
            >
              Bottoms & Pants
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/shop"
            onClick={onClose}
            className="text-base text-[#111111] hover:text-[#6B6B6B] transition-colors py-1"
          >
            All Products
          </Link>
          <Link
            href="/collections"
            onClick={onClose}
            className="text-base text-[#111111] hover:text-[#6B6B6B] transition-colors py-1"
          >
            Collections
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="text-base text-[#111111] hover:text-[#6B6B6B] transition-colors py-1"
          >
            About Atelier
          </Link>
        </div>
      </nav>

      {/* Bottom Utility Links */}
      <div className="pt-4 border-t border-[#E8E6E1] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B6B6B]">
        <Link href="/account" onClick={onClose} className="hover:text-[#111111] hover:underline">
          My Account
        </Link>
        <Link href="/wishlist" onClick={onClose} className="hover:text-[#111111] hover:underline">
          Wishlist
        </Link>
        <Link href="/account/orders/BRD-2026-981245" onClick={onClose} className="hover:text-[#111111] hover:underline">
          Track Order
        </Link>
        <Link href="/admin" onClick={onClose} className="hover:text-[#111111] hover:underline">
          Admin
        </Link>
      </div>
    </div>
  );
}
