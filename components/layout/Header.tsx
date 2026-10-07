'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { MobileMenu } from './MobileMenu';
import { AddProductPhotoModal } from '@/components/admin/AddProductPhotoModal';
import { ShoppingBag, Heart, Search, User, Menu, Camera } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addPhotoModalOpen, setAddPhotoModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);
  const wishlistCount = useWishlistStore((state) => state.getItemCount());

  const displayCartCount = mounted ? cartCount : 0;
  const displayWishlistCount = mounted ? wishlistCount : 0;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Transparent -> Solid background after ~40px scroll
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Mobile Hide-on-scroll-down, Show-on-scroll-up
      if (currentScrollY > 100 && currentScrollY > lastScrollY && window.innerWidth < 768) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const pathname = usePathname();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b border-[#E8E6E1] ${
          isScrolled
            ? 'bg-[#FAFAF8]/95 backdrop-blur-md text-[#111111]'
            : 'bg-[#FAFAF8]/90 backdrop-blur-sm text-[#111111]'
        } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-18 flex items-center justify-between">
          {/* LEFT SIDE: Brand Logo + Nav Links */}
          <div className="flex items-center gap-6 lg:gap-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="md:hidden p-2 -ml-2 text-[#111111] hover:text-[#6B6B6B] transition-colors"
              >
                <Menu className="w-5 h-5 stroke-[1.5]" />
              </button>
              <Link
                href="/"
                className="text-base md:text-lg font-medium tracking-[0.04em] text-[#111111] whitespace-nowrap"
              >
                {CONFIG.brandName}
              </Link>
            </div>

            {/* Clean, evenly spaced 13px nav links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] tracking-[0.04em]">
              <Link
                href="/shop?gender=male"
                className="text-[#6B6B6B] hover:text-[#111111] transition-colors py-1 hover:underline underline-offset-4 decoration-1"
              >
                Men
              </Link>
              <Link
                href="/shop?gender=female"
                className="text-[#6B6B6B] hover:text-[#111111] transition-colors py-1 hover:underline underline-offset-4 decoration-1"
              >
                Women
              </Link>
              <Link
                href="/shop?gender=kids"
                className="text-[#6B6B6B] hover:text-[#111111] transition-colors py-1 hover:underline underline-offset-4 decoration-1"
              >
                Kids
              </Link>

              <span className="w-px h-3.5 bg-[#E8E6E1] select-none" />

              <div className="hidden lg:flex items-center gap-6 text-[13px] text-[#6B6B6B]">
                <Link href="/shop/t-shirts" className="hover:text-[#111111] transition-colors hover:underline underline-offset-4 decoration-1">
                  Tees
                </Link>
                <Link href="/shop/shirts" className="hover:text-[#111111] transition-colors hover:underline underline-offset-4 decoration-1">
                  Shirts
                </Link>
                <Link href="/shop/hoodies" className="hover:text-[#111111] transition-colors hover:underline underline-offset-4 decoration-1">
                  Hoodies
                </Link>
                <Link href="/shop/jackets" className="hover:text-[#111111] transition-colors hover:underline underline-offset-4 decoration-1">
                  Jackets
                </Link>
                <Link href="/shop/bottoms" className="hover:text-[#111111] transition-colors hover:underline underline-offset-4 decoration-1">
                  Bottoms
                </Link>
              </div>
            </nav>
          </div>

          {/* RIGHT SIDE: Ghost Add Photo button + Search + Wishlist + Account + Bag */}
          <div className="flex items-center gap-1 sm:gap-2 text-[13px]">
            {/* Ghost Add Photo action */}
            <button
              onClick={() => setAddPhotoModalOpen(true)}
              className="flex items-center gap-1.5 text-[#6B6B6B] hover:text-[#111111] px-2 py-1 text-[13px] transition-colors rounded-none focus-visible:outline-2 focus-visible:outline-black"
              title="Add photo"
            >
              <Camera className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden xl:inline text-xs font-normal">Add photo</span>
            </button>

            {/* Search */}
            <Link
              href="/search"
              aria-label="Search items"
              className="p-2 text-[#111111] hover:text-[#6B6B6B] transition-colors focus-visible:outline-2 focus-visible:outline-black"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist with ${displayWishlistCount} items`}
              className="p-2 text-[#111111] hover:text-[#6B6B6B] transition-colors relative focus-visible:outline-2 focus-visible:outline-black"
            >
              <Heart className={`w-5 h-5 stroke-[1.5] ${displayWishlistCount > 0 ? 'fill-black' : ''}`} />
              {displayWishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#111111]" />
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Customer Account"
              className="hidden md:flex p-2 text-[#111111] hover:text-[#6B6B6B] transition-colors focus-visible:outline-2 focus-visible:outline-black"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Bag Drawer Trigger */}
            <button
              onClick={openCart}
              aria-label={`Shopping bag with ${displayCartCount} items`}
              className="p-2 text-[#111111] hover:text-[#6B6B6B] transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-black"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className="text-[13px] font-normal text-[#111111]">({displayCartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Overlay */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Owner Add Photo & Garment Studio Modal */}
      <AddProductPhotoModal
        isOpen={addPhotoModalOpen}
        onClose={() => setAddPhotoModalOpen(false)}
        onSuccess={() => {
          // Trigger page reload if on shop or home so new item renders immediately
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
      />
    </>
  );
}
