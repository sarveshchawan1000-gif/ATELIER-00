'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { MobileMenu } from './MobileMenu';
import { ShoppingBag, Heart, Search, User, Menu } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          {/* LOGO Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 -ml-2 text-black hover:bg-cyan transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link
              href="/"
              className="font-display text-xl md:text-2xl font-bold tracking-tighter text-black uppercase"
            >
              {CONFIG.brandName}
            </Link>
          </div>

          {/* Desktop Nav Centre: MALE, FEMALE, KIDS Sections */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-display text-xs tracking-widest font-bold uppercase">
            <Link href="/shop?gender=male" className="hover:text-cyan transition-colors py-2 border-b-2 border-transparent hover:border-black">
              MALE
            </Link>
            <Link href="/shop?gender=female" className="hover:text-cyan transition-colors py-2 border-b-2 border-transparent hover:border-black">
              FEMALE
            </Link>
            <Link href="/shop?gender=kids" className="hover:text-cyan transition-colors py-2 border-b-2 border-transparent hover:border-black">
              KIDS
            </Link>
            <span className="text-grey select-none">|</span>
            <Link href="/shop" className="hover:text-cyan transition-colors py-2 border-b-2 border-transparent hover:border-black text-charcoal">
              ALL
            </Link>
            <Link href="/collections" className="hover:text-cyan transition-colors py-2 border-b-2 border-transparent hover:border-black text-charcoal">
              COLLECTIONS
            </Link>
            <Link href="/about" className="hover:text-cyan transition-colors py-2 border-b-2 border-transparent hover:border-black text-charcoal">
              ABOUT
            </Link>
          </nav>

          {/* Icons Right */}
          <div className="flex items-center gap-2 md:gap-4 font-display text-xs tracking-wider">
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
    </>
  );
}
