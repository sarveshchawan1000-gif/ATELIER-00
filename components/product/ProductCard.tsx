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

  // Determine stock status
  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const isSoldOut = totalStock === 0;

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
      {/* Product Image Container (3:4 Aspect Ratio, #F3F2EF background, no border) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F2EF] rounded-none">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-400 ease-out group-hover:scale-[1.03] ${
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
              className={`object-cover transition-all duration-400 ease-out group-hover:scale-[1.03] absolute inset-0 ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
              priority={false}
            />
          )}
        </Link>

        {/* Minimal Badges if needed (e.g. Sold Out) */}
        {isSoldOut && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[11px] font-normal tracking-[0.04em] bg-[#111111]/80 text-white backdrop-blur-xs">
            Sold out
          </span>
        )}

        {/* Wishlist Heart Button: 36px white 70% translucent circular background */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-2.5 right-2.5 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#111111] hover:bg-white transition-all cursor-pointer ${
            isSaved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-5 h-5 stroke-[1.5] ${isSaved ? 'fill-[#111111] text-[#111111]' : ''}`} />
        </button>

        {/* Desktop Quick Add Bar: slides up from bottom on hover */}
        {!isSoldOut && !showSizePicker && (
          <button
            onClick={handleQuickAddBarClick}
            className="hidden md:flex absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-white/95 backdrop-blur-sm text-[#111111] hover:bg-[#111111] hover:text-white py-3 text-[13px] font-normal items-center justify-center cursor-pointer shadow-xs"
          >
            Quick add
          </button>
        )}

        {/* Mobile Quick Add Button */}
        {!isSoldOut && !showSizePicker && (
          <button
            onClick={handleQuickAddBarClick}
            aria-label={`Quick add ${product.name}`}
            className="md:hidden absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#111111] shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[1.5]" />
          </button>
        )}

        {/* Size Selection Overlay if multiple sizes */}
        {showSizePicker && (
          <div
            className="absolute inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur-sm p-3 flex flex-col gap-2 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-[11px] text-[#6B6B6B]">
              <span>Select size</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizePicker(false);
                }}
                className="p-1 text-[#111111] hover:text-[#6B6B6B]"
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
                    className={`px-3 py-1.5 text-xs border transition-colors ${
                      inStock
                        ? 'border-[#E8E6E1] text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111]'
                        : 'border-[#E8E6E1]/50 text-[#6B6B6B]/40 line-through cursor-not-allowed'
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

      {/* Product Content Details (12px padding-top, no borders) */}
      <div className="pt-3 flex flex-col gap-0.5">
        <span className="text-[12px] text-[#6B6B6B] font-normal leading-tight">
          {product.category.name}
        </span>
        <Link
          href={`/product/${product.slug}`}
          className="text-[14px] font-normal text-[#111111] hover:text-[#6B6B6B] transition-colors leading-snug line-clamp-1"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 text-[14px] text-[#111111] mt-0.5">
          <span>{formatINR(product.sale_price || product.mrp)}</span>
          {product.sale_price && product.sale_price < product.mrp && (
            <span className="text-[#6B6B6B] line-through text-[13px]">
              {formatINR(product.mrp)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
