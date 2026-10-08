'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductWithDetails } from '@/lib/db/types';
import { formatINR } from '@/lib/pricing';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useCartStore } from '@/lib/cart-store';
import { useToast } from '@/components/ui/Toast';
import { Heart, Plus, X } from 'lucide-react';

export interface ProductCardProps {
  product: ProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  const isSaved = isInWishlist(product.id);

  const primaryImage = product.images.find((i) => i.is_primary) || product.images[0];
  const secondaryImage = product.images.find((i) => !i.is_primary) || (product.images.length > 1 ? product.images[1] : null);

  // Calculate total stock and low-stock count
  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const isSoldOut = totalStock === 0;
  const isLowStock = !isSoldOut && totalStock <= 3;
  const discountPercent = product.sale_price && product.sale_price < product.mrp
    ? Math.round(((product.mrp - product.sale_price) / product.mrp) * 100)
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist({
      productId: product.id,
      productName: product.name,
      mrpPaise: product.mrp,
      salePricePaise: product.sale_price,
      imageUrl: primaryImage.url,
      slug: product.slug,
    });
    showToast(added ? `Saved ${product.name} to wishlist` : `Removed from wishlist`);
  };

  const handleQuickAdd = (e: React.MouseEvent, size: string, variantId: string) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      variantId,
      productId: product.id,
      productName: product.name,
      colour: product.variants[0]?.colour || 'Default',
      size,
      unitPricePaise: product.sale_price || product.mrp,
      quantity: 1,
      imageUrl: primaryImage.url,
    });
    setShowSizePicker(false);
    showToast(`Added ${product.name} (${size}) to bag`);
  };

  const handleQuickAddBarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;

    const inStockVariants = product.variants.filter((v) => v.stock > 0);
    if (inStockVariants.length === 1) {
      handleQuickAdd(e, inStockVariants[0].size, inStockVariants[0].id);
    } else {
      setShowSizePicker(!showSizePicker);
    }
  };

  return (
    <article
      className="group relative flex flex-col bg-transparent select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSizePicker(false);
      }}
    >
      {/* Product Image Container (4:5 Aspect Ratio, #EFEAE1 background) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFEAE1] rounded-none">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative focus-visible:outline-2 focus-visible:outline-black">
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-400 ease-out group-hover:scale-[1.04] ${
              hovered && secondaryImage ? 'opacity-0' : 'opacity-100'
            }`}
            priority={false}
          />
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.alt_text || product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-400 ease-out group-hover:scale-[1.04] absolute inset-0 ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
              priority={false}
            />
          )}
        </Link>

        {/* Stock & Discount Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {isSoldOut ? (
            <span className="px-2 py-0.5 font-display text-[10px] font-bold tracking-widest bg-black text-white uppercase">
              Sold out
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 font-display text-[10px] font-bold tracking-widest bg-cyan text-black uppercase">
              Only {totalStock} left
            </span>
          ) : null}
          {discountPercent > 0 && !isSoldOut && (
            <span className="px-2 py-0.5 font-display text-[10px] font-bold tracking-widest bg-black text-white uppercase">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-2.5 right-2.5 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-black hover:bg-white transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-black ${
            isSaved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
          }`}
        >
          <Heart className={`w-4 h-4 stroke-[2] ${isSaved ? 'fill-black text-black' : ''}`} />
        </button>

        {/* Desktop Quick Add Bar */}
        {!isSoldOut && !showSizePicker && (
          <button
            onClick={handleQuickAddBarClick}
            className="hidden md:flex absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 ease-out bg-black text-white hover:bg-charcoal py-3 font-display text-xs font-bold tracking-widest uppercase items-center justify-center cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-cyan"
          >
            Quick Add +
          </button>
        )}

        {/* Mobile Quick Add Button */}
        {!isSoldOut && !showSizePicker && (
          <button
            onClick={handleQuickAddBarClick}
            aria-label={`Quick add ${product.name}`}
            className="md:hidden absolute bottom-2.5 right-2.5 z-20 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
          </button>
        )}

        {/* Size Selection Overlay */}
        {showSizePicker && (
          <div
            className="absolute inset-x-0 bottom-0 z-30 bg-offwhite p-3 flex flex-col gap-2 border-t-2 border-black animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between font-display text-[10px] font-bold tracking-widest uppercase text-charcoal">
              <span>Select Size</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizePicker(false);
                }}
                className="p-1 text-black hover:text-charcoal focus-visible:outline-2 focus-visible:outline-black"
                aria-label="Close size picker"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((variant) => {
                const inStock = variant.stock > 0;
                return (
                  <button
                    key={variant.id}
                    disabled={!inStock}
                    onClick={(e) => handleQuickAdd(e, variant.size, variant.id)}
                    className={`px-3 py-1.5 font-display text-xs font-bold uppercase border transition-colors ${
                      inStock
                        ? 'border-black text-black hover:bg-black hover:text-white cursor-pointer'
                        : 'border-grey text-charcoal/40 line-through cursor-not-allowed bg-cream/40'
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="pt-3 flex flex-col gap-1">
        <span className="font-display text-[11px] font-bold tracking-widest uppercase text-charcoal leading-tight">
          {product.category.name}
        </span>
        <Link
          href={`/product/${product.slug}`}
          className="font-display text-[15px] font-bold tracking-tight text-black hover:text-charcoal transition-colors leading-snug line-clamp-1 flex items-center justify-between group/title focus-visible:outline-2 focus-visible:outline-black"
        >
          <span>{product.name}</span>
          <span className="text-xs text-charcoal group-hover/title:translate-x-1 group-focus-visible/title:translate-x-1 transition-transform inline-block">
            →
          </span>
        </Link>
        <div className="flex items-center gap-2 font-display text-[14px] font-bold text-black mt-0.5">
          <span>{formatINR(product.sale_price || product.mrp)}</span>
          {product.sale_price && product.sale_price < product.mrp && (
            <span className="text-charcoal/60 line-through text-[13px] font-normal">
              {formatINR(product.mrp)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
