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
  const pathname = usePathname();
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

  // On the homepage, the header starts over the dark hero section.
  // On all other pages (shop, collections, about, etc.) or when scrolled,
  // the background is light (white/cream), so the header text must be high-contrast dark.
  const isHomePage = pathname === '/';
  const isDarkHero = isHomePage && !isScrolled;

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

  // Sync scroll state on route change
  useEffect(() => {
    setIsScrolled(window.scrollY > 40);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
          isDarkHero
            ? 'bg-transparent backdrop-blur-xs text-white border-transparent'
            : 'bg-cream/95 backdrop-blur-md text-black border-grey/50 shadow-sm'
        } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* LEFT: Brand Logo + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className={`md:hidden p-2 -ml-2 transition-colors focus-visible:outline-2 ${
                isDarkHero
                  ? 'text-white hover:text-white/70 focus-visible:outline-white'
                  : 'text-black hover:text-charcoal focus-visible:outline-black'
              }`}
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
            <Link
              href="/"
              className={`font-display text-lg md:text-xl font-semibold tracking-tight uppercase flex items-center gap-1 group transition-colors ${
                isDarkHero ? 'text-white' : 'text-black'
              }`}
            >
              <span>{CONFIG.brandHalves.left}</span>
              <span
                className={`transition-colors ${
                  isDarkHero
                    ? 'text-white/60 group-hover:text-white'
                    : 'text-charcoal group-hover:text-black'
                }`}
              >
                {CONFIG.brandHalves.right}
              </span>
            </Link>
          </div>

          {/* CENTRE NAV */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 font-body text-sm font-medium tracking-wide">
            <Link
              href="/shop"
              className={`transition-colors py-1 ${
                pathname.startsWith('/shop')
                  ? isDarkHero
                    ? 'text-white font-semibold'
                    : 'text-black font-semibold'
                  : isDarkHero
                  ? 'text-white/80 hover:text-white'
                  : 'text-charcoal hover:text-black'
              }`}
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className={`transition-colors py-1 ${
                pathname.startsWith('/collections')
                  ? isDarkHero
                    ? 'text-white font-semibold'
                    : 'text-black font-semibold'
                  : isDarkHero
                  ? 'text-white/80 hover:text-white'
                  : 'text-charcoal hover:text-black'
              }`}
            >
              Collections
            </Link>
            <Link
              href="/about"
              className={`transition-colors py-1 ${
                pathname === '/about'
                  ? isDarkHero
                    ? 'text-white font-semibold'
                    : 'text-black font-semibold'
                  : isDarkHero
                  ? 'text-white/80 hover:text-white'
                  : 'text-charcoal hover:text-black'
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
                isDarkHero
                  ? 'text-white/70 hover:text-white focus-visible:outline-white'
                  : 'text-charcoal hover:text-black focus-visible:outline-black'
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
                isDarkHero
                  ? 'text-white hover:text-white/70 focus-visible:outline-white'
                  : 'text-black hover:text-charcoal focus-visible:outline-black'
              }`}
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist with ${displayWishlistCount} items`}
              className={`p-2 transition-colors relative focus-visible:outline-2 ${
                isDarkHero
                  ? 'text-white hover:text-white/70 focus-visible:outline-white'
                  : 'text-black hover:text-charcoal focus-visible:outline-black'
              }`}
            >
              <Heart
                className={`w-5 h-5 stroke-[1.5] ${
                  displayWishlistCount > 0 ? (isDarkHero ? 'fill-white' : 'fill-black') : ''
                }`}
              />
              {displayWishlistCount > 0 && (
                <span
                  className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                    isDarkHero ? 'bg-white' : 'bg-black'
                  }`}
                />
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Customer Account"
              className={`hidden md:flex p-2 transition-colors focus-visible:outline-2 ${
                isDarkHero
                  ? 'text-white hover:text-white/70 focus-visible:outline-white'
                  : 'text-black hover:text-charcoal focus-visible:outline-black'
              }`}
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Bag Drawer Trigger */}
            <button
              onClick={openCart}
              aria-label={`Shopping bag with ${displayCartCount} items`}
              className={`p-2 transition-colors flex items-center gap-1 focus-visible:outline-2 ${
                isDarkHero
                  ? 'text-white hover:text-white/70 focus-visible:outline-white'
                  : 'text-black hover:text-charcoal focus-visible:outline-black'
              }`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span
                className={`text-[13px] font-normal ${
                  isDarkHero ? 'text-white/60' : 'text-charcoal'
                }`}
              >
                ({displayCartCount})
              </span>
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
