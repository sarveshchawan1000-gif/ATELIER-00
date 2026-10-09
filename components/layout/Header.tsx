'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md text-black border-grey/50 shadow-sm'
            : 'bg-transparent backdrop-blur-xs text-white border-transparent'
        } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* LEFT: Brand Logo + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className={`md:hidden p-2 -ml-2 transition-colors focus-visible:outline-2 ${
                isScrolled
                  ? 'text-black hover:text-charcoal focus-visible:outline-black'
                  : 'text-white hover:text-white/70 focus-visible:outline-white'
              }`}
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
            <Link
              href="/"
              className={`font-display text-lg md:text-xl font-semibold tracking-tight uppercase flex items-center gap-1 group transition-colors ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              <span>{CONFIG.brandHalves.left}</span>
              <span className={`transition-colors ${
                isScrolled
                  ? 'text-charcoal group-hover:text-black'
                  : 'text-white/60 group-hover:text-white'
              }`}>{CONFIG.brandHalves.right}</span>
            </Link>
          </div>

          {/* CENTRE NAV */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 font-body text-sm font-medium tracking-wide">
            <Link
              href="/shop"
              className={`transition-colors py-1 ${
                isScrolled ? 'text-charcoal hover:text-black' : 'text-white/80 hover:text-white'
              }`}
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className={`transition-colors py-1 ${
                isScrolled ? 'text-charcoal hover:text-black' : 'text-white/80 hover:text-white'
              }`}
            >
              Collections
            </Link>
            <Link
              href="/about"
              className={`transition-colors py-1 ${
                isScrolled ? 'text-charcoal hover:text-black' : 'text-white/80 hover:text-white'
              }`}
            >
              About
            </Link>
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 text-[13px]">
            {/* Ghost Add Photo action */}
            <button
              onClick={() => setAddPhotoModalOpen(true)}
              className={`flex items-center gap-1.5 px-2 py-1 text-[13px] transition-colors rounded-none focus-visible:outline-2 ${
                isScrolled
                  ? 'text-charcoal hover:text-black focus-visible:outline-black'
                  : 'text-white/70 hover:text-white focus-visible:outline-white'
              }`}
              title="Add photo"
            >
              <Camera className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden xl:inline text-xs font-normal">Add photo</span>
            </button>

            {/* Search */}
            <Link
              href="/search"
              aria-label="Search items"
              className={`p-2 transition-colors focus-visible:outline-2 ${
                isScrolled
                  ? 'text-black hover:text-charcoal focus-visible:outline-black'
                  : 'text-white hover:text-white/70 focus-visible:outline-white'
              }`}
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist with ${displayWishlistCount} items`}
              className={`p-2 transition-colors relative focus-visible:outline-2 ${
                isScrolled
                  ? 'text-black hover:text-charcoal focus-visible:outline-black'
                  : 'text-white hover:text-white/70 focus-visible:outline-white'
              }`}
            >
              <Heart className={`w-5 h-5 stroke-[1.5] ${displayWishlistCount > 0 ? (isScrolled ? 'fill-black' : 'fill-white') : ''}`} />
              {displayWishlistCount > 0 && (
                <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${isScrolled ? 'bg-black' : 'bg-white'}`} />
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Customer Account"
              className={`hidden md:flex p-2 transition-colors focus-visible:outline-2 ${
                isScrolled
                  ? 'text-black hover:text-charcoal focus-visible:outline-black'
                  : 'text-white hover:text-white/70 focus-visible:outline-white'
              }`}
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Bag Drawer Trigger */}
            <button
              onClick={openCart}
              aria-label={`Shopping bag with ${displayCartCount} items`}
              className={`p-2 transition-colors flex items-center gap-1 focus-visible:outline-2 ${
                isScrolled
                  ? 'text-black hover:text-charcoal focus-visible:outline-black'
                  : 'text-white hover:text-white/70 focus-visible:outline-white'
              }`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className={`text-[13px] font-normal ${isScrolled ? 'text-charcoal' : 'text-white/60'}`}>({displayCartCount})</span>
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
