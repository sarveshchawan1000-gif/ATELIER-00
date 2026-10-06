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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md border-grey text-black shadow-sm'
            : 'bg-transparent border-transparent text-black'
        } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* LEFT SIDE: Brand Logo + Shifted MALE, FEMALE, KIDS Sections + Kinds of Cloth */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="md:hidden p-2 -ml-2 text-black hover:bg-cyan transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link
                href="/"
                className="font-display text-xl md:text-2xl font-bold tracking-tighter text-black uppercase whitespace-nowrap"
              >
                {CONFIG.brandName}
              </Link>
            </div>

            {/* Shifted to the LEFT: MALE, FEMALE, KIDS Sections */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-3 font-display text-xs tracking-widest font-bold uppercase border-l-2 border-black pl-4">
              <Link
                href="/shop?gender=male"
                className="hover:text-cyan hover:bg-black py-1.5 px-2.5 border border-transparent hover:border-black transition-colors"
              >
                MALE
              </Link>
              <Link
                href="/shop?gender=female"
                className="hover:text-cyan hover:bg-black py-1.5 px-2.5 border border-transparent hover:border-black transition-colors"
              >
                FEMALE
              </Link>
              <Link
                href="/shop?gender=kids"
                className="hover:text-cyan hover:bg-black py-1.5 px-2.5 border border-transparent hover:border-black transition-colors"
              >
                KIDS
              </Link>
              <span className="text-grey select-none">|</span>

              {/* Different Kinds of Cloth on Left */}
              <div className="hidden xl:flex items-center gap-2 text-[11px] text-charcoal font-semibold">
                <Link href="/shop/t-shirts" className="hover:text-black hover:underline px-1 py-1">
                  TEES
                </Link>
                <Link href="/shop/shirts" className="hover:text-black hover:underline px-1 py-1">
                  SHIRTS
                </Link>
                <Link href="/shop/hoodies" className="hover:text-black hover:underline px-1 py-1">
                  HOODIES
                </Link>
                <Link href="/shop/jackets" className="hover:text-black hover:underline px-1 py-1">
                  JACKETS
                </Link>
                <Link href="/shop/bottoms" className="hover:text-black hover:underline px-1 py-1">
                  BOTTOMS
                </Link>
              </div>
            </nav>
          </div>

          {/* RIGHT SIDE: Owner Add Photo button + Search + Wishlist + Account + Bag */}
          <div className="flex items-center gap-2 md:gap-3 font-display text-xs tracking-wider">
            {/* Owner Add Photo Action */}
            <button
              onClick={() => setAddPhotoModalOpen(true)}
              className="flex items-center gap-1.5 bg-black text-cyan hover:bg-cyan hover:text-black px-2.5 py-1.5 border border-black font-display text-[10px] font-bold uppercase transition-colors"
              title="Add garment photo as owner"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ ADD PHOTO</span>
            </button>
            {/* Search */}
            <Link
              href="/search"
              aria-label="Search items"
              className="p-2 text-black hover:bg-cyan transition-colors rounded-none"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist with ${displayWishlistCount} items`}
              className="p-2 text-black hover:bg-cyan transition-colors relative"
            >
              <Heart className={`w-5 h-5 ${displayWishlistCount > 0 ? 'fill-black' : ''}`} />
              {displayWishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan text-black font-bold text-[10px] w-4 h-4 flex items-center justify-center rounded-none">
                  {displayWishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Customer Account"
              className="hidden md:flex p-2 text-black hover:bg-cyan transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Bag Drawer Trigger */}
            <button
              onClick={openCart}
              aria-label={`Shopping bag with ${displayCartCount} items`}
              className="p-2 text-black hover:bg-cyan transition-colors flex items-center gap-1.5 font-bold"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-display text-xs tracking-wider">[{displayCartCount.toString().padStart(2, '0')}]</span>
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
