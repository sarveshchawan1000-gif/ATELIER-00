'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useCartStore } from '@/lib/cart-store';
import { formatINR } from '@/lib/pricing';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { SEED_PRODUCTS } from '@/lib/db/seed-data';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addCartItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  const handleMoveToCart = (item: typeof items[0]) => {
    // Find the product to get variant info
    const product = SEED_PRODUCTS.find((p) => p.id === item.productId);
    if (!product) return;

    // Get first available variant
    const availableVariant = product.variants.find((v) => v.stock > 0);
    if (!availableVariant) {
      showToast('SORRY, THIS ITEM IS CURRENTLY OUT OF STOCK');
      return;
    }

    const primaryImage = product.images.find((i) => i.is_primary) || product.images[0];

    addCartItem({
      variantId: availableVariant.id,
      productId: product.id,
      productName: product.name,
      colour: availableVariant.colour,
      size: availableVariant.size,
      unitPricePaise: product.sale_price || product.mrp,
      quantity: 1,
      imageUrl: primaryImage?.url || '',
    });

    removeItem(item.productId);
    showToast(`MOVED ${product.name} TO BAG`);
  };

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId);
    showToast(`REMOVED ${name} FROM WISHLIST`);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-8 py-20">
          <div className="w-24 h-24 border-2 border-black flex items-center justify-center">
            <Heart className="w-10 h-10 text-charcoal" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tighter uppercase">
              YOUR WISHLIST IS EMPTY
            </h1>
            <p className="font-body text-sm text-charcoal max-w-md mx-auto">
              Save pieces you love by tapping the heart icon on any product.
              Your wishlist will be waiting when you return.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              EXPLORE THE COLLECTION
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tighter uppercase">
            SAVED ITEMS [{items.length}]
          </h1>
          <button
            onClick={() => {
              clearWishlist();
              showToast('WISHLIST CLEARED');
            }}
            className="font-display text-xs tracking-wider text-charcoal hover:text-error-red transition-colors underline"
          >
            CLEAR ALL
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = SEED_PRODUCTS.find((p) => p.id === item.productId);
            const totalStock = product
              ? product.variants.reduce((acc, v) => acc + v.stock, 0)
              : 0;
            const isSoldOut = totalStock === 0;

            return (
              <article
                key={item.productId}
                className="group bg-offwhite border border-grey/50 hover:border-black transition-all"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative block aspect-[4/5] overflow-hidden bg-grey/20"
                >
                  {item.imageUrl && item.imageUrl.startsWith('http') ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-xs text-charcoal">
                      4:5 IMAGE
                    </div>
                  )}

                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="font-display text-sm font-bold text-cream tracking-widest uppercase">
                        SOLD OUT
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3 border-t border-grey/30">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-display text-xs font-bold tracking-wider text-black uppercase hover:text-cyan transition-colors line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-display text-sm font-bold text-black">
                        {formatINR(item.salePricePaise || item.mrpPaise)}
                      </span>
                      {item.salePricePaise && item.salePricePaise < item.mrpPaise && (
                        <span className="font-display text-xs text-charcoal/60 line-through">
                          {formatINR(item.mrpPaise)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleMoveToCart(item)}
                      disabled={isSoldOut}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                      {isSoldOut ? 'SOLD OUT' : 'MOVE TO BAG'}
                    </Button>
                    <button
                      onClick={() => handleRemove(item.productId, item.productName)}
                      aria-label={`Remove ${item.productName} from wishlist`}
                      className="p-2 border border-black text-charcoal hover:text-error-red hover:border-error-red transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button variant="ghost" size="lg">
              CONTINUE SHOPPING
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
