'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductWithDetails } from '@/lib/db/types';
import { formatINR, calculateDiscountPercentage } from '@/lib/pricing';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useCartStore } from '@/lib/cart-store';
import { useToast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/Badge';
import { Heart, ShoppingBag } from 'lucide-react';

export interface ProductCardProps {
  product: ProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  const isSaved = isInWishlist(product.id);
  const discount = calculateDiscountPercentage(product.mrp, product.sale_price);

  const primaryImage = product.images.find((i) => i.is_primary) || product.images[0];
  const secondaryImage = product.images[1] || primaryImage;

  // Determine stock status
  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const isSoldOut = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 3;

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
    showToast(added ? `SAVED ${product.name} TO WISHLIST` : `REMOVED FROM WISHLIST`);
  };

  const handleQuickAdd = (e: React.MouseEvent, size: string, variantId: string) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      variantId,
      productId: product.id,
      productName: product.name,
      colour: product.variants[0]?.colour || 'DEFAULT',
      size,
      unitPricePaise: product.sale_price || product.mrp,
      quantity: 1,
      imageUrl: primaryImage.url,
    });
    setShowQuickAdd(false);
    showToast(`ADDED ${product.name} (${size}) TO BAG`);
  };

  return (
    <article
      className="group relative flex flex-col bg-offwhite border border-grey/50 transition-all duration-200 hover:border-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowQuickAdd(false);
      }}
    >
      {/* Product Image Container (Fixed 4:5 Aspect Ratio) */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-grey/20">
        <Image
          src={hovered && secondaryImage ? secondaryImage.url : primaryImage.url}
          alt={primaryImage.alt_text}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          priority={false}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {isSoldOut && <Badge variant="dark">SOLD OUT</Badge>}
          {!isSoldOut && isLowStock && <Badge variant="error">ONLY {totalStock} LEFT</Badge>}
          {discount > 0 && <Badge variant="accent">{discount}% OFF</Badge>}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-2 right-2 z-20 p-2 bg-cream/90 border border-black/20 hover:border-black hover:bg-cyan text-black transition-colors rounded-none"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover / Touch */}
        {showQuickAdd && (
          <div
            className="absolute inset-x-0 bottom-0 z-30 bg-black/95 p-3 flex flex-col gap-2 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-display text-[10px] font-bold text-cyan tracking-wider uppercase">
              SELECT SIZE
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((variant) => {
                const inStock = variant.stock > 0;
                return (
                  <button
                    key={variant.id}
                    disabled={!inStock}
                    onClick={(e) => handleQuickAdd(e, variant.size, variant.id)}
                    className={`px-2.5 py-1 text-xs font-display font-bold border transition-colors ${
                      inStock
                        ? 'border-grey text-cream hover:bg-cyan hover:text-black hover:border-cyan'
                        : 'border-grey/30 text-grey/40 line-through cursor-not-allowed'
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-2 border-t border-grey/30">
        <div>
          <span className="font-display text-[10px] text-charcoal tracking-widest uppercase block mb-0.5">
            {product.category.name}
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="font-display text-xs font-bold tracking-wider text-black uppercase hover:text-cyan transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-grey/20">
          <div className="flex items-center gap-2 font-display text-xs font-bold">
            <span className="text-black">{formatINR(product.sale_price || product.mrp)}</span>
            {product.sale_price && product.sale_price < product.mrp && (
              <span className="text-charcoal/60 line-through text-[11px]">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>

          {/* Quick Add Popover Trigger */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowQuickAdd(!showQuickAdd);
            }}
            disabled={isSoldOut}
            aria-label={`Quick add ${product.name} to bag`}
            className="text-[11px] font-display font-bold uppercase tracking-wider underline hover:bg-cyan hover:no-underline px-1 py-0.5 transition-colors disabled:opacity-30"
          >
            + QUICK ADD
          </button>
        </div>
      </div>
    </article>
  );
}
