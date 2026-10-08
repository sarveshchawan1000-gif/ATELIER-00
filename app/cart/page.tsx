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
      <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8 bg-cream text-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-6 py-20">
          <div className="w-16 h-16 rounded-full bg-offwhite border border-grey/40 flex items-center justify-center text-charcoal">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              Your bag is empty
            </h1>
            <p className="font-body text-sm text-charcoal max-w-md mx-auto">
              It looks like you haven&apos;t added anything to your bag yet.
              Discover pieces from our latest collections.
            </p>
          </div>
          <Link href="/shop">
            <Button variant="primary" size="lg" className="bg-black text-white hover:bg-charcoal rounded-sm font-medium">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#111]">
            Your Bag ({items.length})
          </h1>
          <button
            onClick={() => {
              clearCart();
              showToast('BAG CLEARED');
            }}
            className="text-xs text-[#6B6B6B] hover:text-[#111] transition-colors underline underline-offset-4"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items Column */}
          <div className="lg:col-span-8">
            {/* Free Shipping Progress */}
            <div className="mb-6 bg-white border border-[#E8E6E1] p-4 rounded-sm">
              {freeShippingNeeded > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#6B6B6B] flex items-center gap-2">
                      <Truck className="w-4 h-4 stroke-[1.5]" />
                      Add {formatINR(freeShippingNeeded)} more for complimentary shipping
                    </span>
                    <span className="text-xs text-[#6B6B6B]">
                      {Math.round(freeShippingProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-[#F3F2EF] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#111] transition-all duration-500 ease-out"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs font-medium text-[#111]">
                  <Truck className="w-4 h-4 stroke-[1.5]" />
                  You qualify for complimentary shipping
                </div>
              )}
            </div>

            {/* Item List */}
            <div className="flex flex-col divide-y divide-[#E8E6E1]">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="py-6 first:pt-0 flex gap-4 md:gap-6 group/item"
                >
                  {/* Product Image */}
                  <div className="w-24 h-32 md:w-28 md:h-36 bg-[#F3F2EF] flex-shrink-0 relative overflow-hidden rounded-sm">
                    {item.imageUrl && item.imageUrl.startsWith('http') ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[#6B6B6B]">
                        3:4
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm md:text-base font-medium text-[#111]">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-[#6B6B6B] mt-1">
                        {item.colour} / {item.size}
                      </p>
                      <p className="text-sm font-medium text-[#111] mt-2">
                        {formatINR(item.unitPricePaise)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E8E6E1] bg-white rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-xs text-[#111] hover:bg-[#F3F2EF] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-3 py-1.5 text-xs text-[#111] min-w-[36px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-xs text-[#111] hover:bg-[#F3F2EF] transition-colors"
                          aria-label="Increase quantity"
                          disabled={item.quantity >= CONFIG.limits.maxCartQuantityPerVariant}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[#111]">
                          {formatINR(item.unitPricePaise * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemove(item.variantId, item.productName)}
                          aria-label={`Remove ${item.productName}`}
                          className="p-1.5 text-[#6B6B6B] hover:text-[#111] transition-colors"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
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
            <div className="bg-white border border-[#E8E6E1] p-6 sticky top-28 rounded-sm">
              <h2 className="text-base font-medium text-[#111] border-b border-[#E8E6E1] pb-3 mb-4">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6B6B]">Subtotal</span>
                  <span className="font-medium text-[#111]">{formatINR(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6B6B]">Shipping</span>
                  <span className="font-medium text-[#111]">
                    {shippingPaise === 0 ? 'Free' : formatINR(shippingPaise)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-[#111] border-t border-[#E8E6E1] pt-3">
                  <span>Total</span>
                  <span>{formatINR(totalPaise)}</span>
                </div>
                <p className="text-[11px] text-[#6B6B6B]">
                  {CONFIG.taxes.gstInclusiveNote}
                </p>
              </div>

              <Link href="/checkout" className="block w-full mb-3">
                <Button variant="primary" fullWidth size="lg">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2 stroke-[1.5]" />
                </Button>
              </Link>

              <Link href="/shop" className="block w-full">
                <Button variant="ghost" fullWidth size="sm">
                  Continue Shopping
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-[#E8E6E1] flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                  <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                  <span>Secure Razorpay Payment Gateway</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                  <Truck className="w-4 h-4 stroke-[1.5]" />
                  <span>Estimated {CONFIG.shipping.estimatedDays} delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                  <span className="text-xs">↩</span>
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
