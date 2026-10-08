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
      showToast('Sorry, this item is currently out of stock.');
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
    showToast(`Added ${product.name} to bag.`);
  };

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId);
    showToast(`Removed ${name} from saved items.`);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8 bg-cream text-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-6 py-20">
          <div className="w-16 h-16 rounded-full bg-offwhite border border-grey/40 flex items-center justify-center text-charcoal">
            <Heart className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              Your wishlist is empty
            </h1>
            <p className="font-body text-sm text-charcoal max-w-md mx-auto">
              Save pieces you love by tapping the heart icon on any product.
              Your wishlist will be waiting when you return.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="primary" size="lg" className="bg-black text-white hover:bg-charcoal rounded-sm font-medium">
              Explore Collections
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8 bg-cream text-black">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-grey/50 pb-4 mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-black">
            Saved Items ({items.length})
          </h1>
          <button
            onClick={() => {
              clearWishlist();
              showToast('Wishlist cleared.');
            }}
            className="font-body text-xs text-charcoal hover:text-black transition-colors underline underline-offset-4"
          >
            Clear all
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
                className="group bg-offwhite border border-grey/40 hover:border-grey rounded-sm overflow-hidden transition-all flex flex-col justify-between"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative block aspect-[4/5] overflow-hidden bg-black/5"
                >
                  {item.imageUrl && item.imageUrl.startsWith('http') ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-body text-xs text-charcoal">
                      No Image
                    </div>
                  )}

                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="font-body text-xs font-medium text-white tracking-widest uppercase">
                        Sold Out
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-body text-sm font-medium text-black hover:text-charcoal transition-colors line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-sm font-semibold text-black">
                        {formatINR(item.salePricePaise || item.mrpPaise)}
                      </span>
                      {item.salePricePaise && item.salePricePaise < item.mrpPaise && (
                        <span className="font-body text-xs text-charcoal/60 line-through">
                          {formatINR(item.mrpPaise)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleMoveToCart(item)}
                      disabled={isSoldOut}
                      className="bg-black text-white hover:bg-charcoal rounded-sm font-medium text-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                      {isSoldOut ? 'Sold Out' : 'Move to Bag'}
                    </Button>
                    <button
                      onClick={() => handleRemove(item.productId, item.productName)}
                      aria-label={`Remove ${item.productName} from wishlist`}
                      className="p-2 border border-grey/40 hover:border-black rounded-sm text-charcoal hover:text-black transition-colors flex-shrink-0"
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
        <div className="mt-14 text-center">
          <Link href="/shop">
            <Button variant="ghost" size="lg" className="rounded-sm font-medium hover:text-black">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
