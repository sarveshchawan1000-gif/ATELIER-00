'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart-store';
import { formatINR, calculateShippingFee } from '@/lib/pricing';
import { CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotalPaise, clearCart } = useCartStore();
  const { showToast } = useToast();

  const subtotalPaise = getSubtotalPaise();
  const shippingPaise = calculateShippingFee(
    subtotalPaise,
    CONFIG.shipping.flatRatePaise,
    CONFIG.shipping.freeShippingThresholdPaise
  );
  const totalPaise = subtotalPaise + shippingPaise;
  const freeShippingNeeded = CONFIG.shipping.freeShippingThresholdPaise - subtotalPaise;
  const freeShippingProgress = Math.min(
    (subtotalPaise / CONFIG.shipping.freeShippingThresholdPaise) * 100,
    100
  );

  const handleRemove = (variantId: string, name: string) => {
    const itemToRestore = items.find((i) => i.variantId === variantId);
    removeItem(variantId);

    if (itemToRestore) {
      showToast(`REMOVED ${name}`, 'UNDO', () => {
        useCartStore.getState().addItem(itemToRestore);
      });
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-8 py-20">
          <div className="w-24 h-24 border-2 border-black flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-charcoal" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tighter uppercase">
              YOUR BAG IS EMPTY
            </h1>
            <p className="font-body text-sm text-charcoal max-w-md mx-auto">
              It looks like you haven&apos;t added anything to your bag yet.
              Discover pieces from our latest exhibition drop.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              CONTINUE SHOPPING
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
            YOUR BAG [{items.length}]
          </h1>
          <button
            onClick={() => {
              clearCart();
              showToast('BAG CLEARED');
            }}
            className="font-display text-xs tracking-wider text-charcoal hover:text-error-red transition-colors underline"
          >
            CLEAR ALL
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items Column */}
          <div className="lg:col-span-8">
            {/* Free Shipping Progress */}
            <div className="mb-6 bg-offwhite border border-grey p-4">
              {freeShippingNeeded > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-xs tracking-wider uppercase flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      ADD {formatINR(freeShippingNeeded)} MORE FOR FREE SHIPPING
                    </span>
                    <span className="font-display text-xs text-charcoal">
                      {Math.round(freeShippingProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-grey">
                    <div
                      className="h-full bg-cyan transition-all duration-500 ease-out"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-cyan font-display text-xs tracking-wider uppercase">
                  <Truck className="w-4 h-4" />
                  ✓ YOU QUALIFY FOR FREE SHIPPING
                </div>
              )}
            </div>

            {/* Item List */}
            <div className="flex flex-col divide-y divide-grey">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="py-6 first:pt-0 flex gap-4 md:gap-6 group/item"
                >
                  {/* Product Image */}
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-offwhite border border-grey flex-shrink-0 relative overflow-hidden">
                    {item.imageUrl && item.imageUrl.startsWith('http') ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display text-[10px] text-charcoal">
                        4:5
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-sm md:text-base font-bold tracking-wider uppercase text-black">
                        {item.productName}
                      </h3>
                      <p className="font-body text-xs text-charcoal uppercase mt-1">
                        {item.colour} / {item.size}
                      </p>
                      <p className="font-display text-sm font-bold text-black mt-2">
                        {formatINR(item.unitPricePaise)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-black bg-offwhite">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-3 py-2 text-sm font-bold hover:bg-cyan transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 font-display text-sm font-bold border-x border-black min-w-[44px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-3 py-2 text-sm font-bold hover:bg-cyan transition-colors"
                          aria-label="Increase quantity"
                          disabled={item.quantity >= CONFIG.limits.maxCartQuantityPerVariant}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-display text-sm font-bold text-black">
                          {formatINR(item.unitPricePaise * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemove(item.variantId, item.productName)}
                          aria-label={`Remove ${item.productName}`}
                          className="p-2 text-charcoal hover:text-error-red hover:bg-error-red/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-offwhite border-2 border-black p-6 sticky top-24">
              <h2 className="font-display text-lg font-bold tracking-wider uppercase border-b border-black pb-3 mb-4">
                ORDER SUMMARY
              </h2>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal uppercase">Subtotal</span>
                  <span className="font-bold text-black">{formatINR(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-charcoal uppercase">Shipping</span>
                  <span className="font-bold text-black">
                    {shippingPaise === 0 ? 'FREE' : formatINR(shippingPaise)}
                  </span>
                </div>
                <div className="flex justify-between font-display text-base font-bold uppercase border-t border-grey pt-3">
                  <span>Total</span>
                  <span>{formatINR(totalPaise)}</span>
                </div>
                <p className="font-body text-[11px] text-charcoal">
                  {CONFIG.taxes.gstInclusiveNote}
                </p>
              </div>

              <Link href="/checkout" className="block w-full mb-3">
                <Button variant="primary" fullWidth size="lg">
                  PROCEED TO CHECKOUT
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link href="/shop" className="block w-full">
                <Button variant="ghost" fullWidth size="sm">
                  CONTINUE SHOPPING
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-grey flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-charcoal">
                  <ShieldCheck className="w-4 h-4 text-cyan" />
                  <span>Secure Razorpay Payment Gateway</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal">
                  <Truck className="w-4 h-4 text-cyan" />
                  <span>Estimated {CONFIG.shipping.estimatedDays} delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal">
                  <span className="text-cyan font-bold text-sm">↩</span>
                  <span>{CONFIG.returns.windowDays}-day hassle-free returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
