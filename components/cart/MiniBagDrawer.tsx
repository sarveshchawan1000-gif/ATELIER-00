'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { formatINR, calculateShippingFee } from '@/lib/pricing';
import { CONFIG } from '@/lib/config';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export function MiniBagDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotalPaise } = useCartStore();
  const { showToast } = useToast();

  const subtotalPaise = getSubtotalPaise();
  const shippingPaise = calculateShippingFee(subtotalPaise, CONFIG.shipping.flatRatePaise, CONFIG.shipping.freeShippingThresholdPaise);
  const totalPaise = subtotalPaise + shippingPaise;

  const freeShippingNeeded = CONFIG.shipping.freeShippingThresholdPaise - subtotalPaise;

  const handleRemove = (variantId: string, name: string) => {
    const itemToRestore = items.find((i) => i.variantId === variantId);
    removeItem(variantId);

    if (itemToRestore) {
      showToast(`REMOVED ${name} FROM BAG`, 'UNDO', () => {
        useCartStore.getState().addItem(itemToRestore);
      });
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={closeCart} title={`YOUR BAG [${items.length}]`}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 gap-6">
          <div className="w-16 h-16 border border-black flex items-center justify-center text-2xl">
            🛍
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-sm font-bold tracking-widest uppercase">
              YOUR BAG IS EMPTY.
            </h3>
            <p className="font-body text-xs text-charcoal max-w-xs">
              Discover something you&apos;ll love from our latest exhibition drop.
            </p>
          </div>
          <Link href="/shop" onClick={closeCart} className="w-full">
            <Button variant="primary" fullWidth>
              SHOP PRODUCTS
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between gap-6">
          {/* Free Shipping Hint */}
          {freeShippingNeeded > 0 ? (
            <div className="bg-cyan/20 border border-cyan p-3 text-xs font-display tracking-wider uppercase text-black">
              ADD {formatINR(freeShippingNeeded)} MORE FOR FREE SHIPPING
            </div>
          ) : (
            <div className="bg-black text-cyan p-3 text-xs font-display tracking-wider uppercase">
              ✓ YOU HAVE QUALIFIED FOR FREE SHIPPING
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 divide-y divide-grey pr-1">
            {items.map((item) => (
              <div key={item.variantId} className="pt-4 first:pt-0 flex gap-4">
                <div className="w-20 h-24 bg-grey/20 border border-grey flex-shrink-0 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center font-display text-[10px] text-charcoal bg-offwhite">
                    4:5 IMAGE
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display text-xs font-bold tracking-wider uppercase text-black">
                        {item.productName}
                      </h4>
                      <p className="font-body text-[11px] text-charcoal uppercase mt-0.5">
                        {item.colour} / {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.variantId, item.productName)}
                      aria-label={`Remove ${item.productName} from bag`}
                      className="text-xs text-charcoal hover:text-error-red p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-black bg-offwhite">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="px-2 py-1 text-xs font-bold hover:bg-cyan transition-colors min-w-[28px]"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-display text-xs font-bold border-x border-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="px-2 py-1 text-xs font-bold hover:bg-cyan transition-colors min-w-[28px]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-display text-xs font-bold text-black">
                      {formatINR(item.unitPricePaise * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Summary */}
          <div className="border-t border-black pt-4 flex flex-col gap-3">
            <div className="flex justify-between font-display text-xs font-bold uppercase">
              <span>SUBTOTAL</span>
              <span>{formatINR(subtotalPaise)}</span>
            </div>
            <div className="flex justify-between font-display text-xs uppercase text-charcoal">
              <span>ESTIMATED SHIPPING</span>
              <span>{shippingPaise === 0 ? 'FREE' : formatINR(shippingPaise)}</span>
            </div>
            <div className="flex justify-between font-display text-sm font-bold uppercase border-t border-grey pt-2 text-black">
              <span>TOTAL</span>
              <span>{formatINR(totalPaise)}</span>
            </div>

            <p className="font-body text-[10px] text-charcoal text-center">
              {CONFIG.taxes.gstInclusiveNote}
            </p>

            <Link href="/checkout" onClick={closeCart} className="w-full mt-1">
              <Button variant="primary" fullWidth size="lg">
                PROCEED TO CHECKOUT
              </Button>
            </Link>

            <Link href="/cart" onClick={closeCart} className="w-full">
              <Button variant="ghost" fullWidth size="sm">
                VIEW FULL BAG
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
