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
    <Drawer isOpen={isOpen} onClose={closeCart} title={`Shopping bag (${items.length})`}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium text-[#111111]">
              Your bag is empty
            </h3>
            <p className="text-xs text-[#6B6B6B] max-w-xs leading-relaxed">
              Explore our latest collection to discover considered everyday garments.
            </p>
          </div>
          <Link href="/shop" onClick={closeCart} className="w-full">
            <Button variant="primary" fullWidth>
              Shop collection
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between gap-6">
          {/* Free Shipping Hint */}
          {freeShippingNeeded > 0 ? (
            <div className="bg-[#F3F2EF] p-3 text-xs text-[#111111]">
              Add {formatINR(freeShippingNeeded)} more for free shipping
            </div>
          ) : (
            <div className="bg-[#111111] text-white p-3 text-xs">
              ✓ You qualify for free shipping
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 divide-y divide-[#E8E6E1] pr-1">
            {items.map((item) => (
              <div key={item.variantId} className="pt-4 first:pt-0 flex gap-4">
                <div className="w-20 h-24 bg-[#F3F2EF] flex-shrink-0 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] text-[#6B6B6B]">
                      Item
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-[13px] font-medium text-[#111111]">
                        {item.productName}
                      </h4>
                      <p className="text-[12px] text-[#6B6B6B] mt-0.5">
                        {item.colour} / {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.variantId, item.productName)}
                      aria-label={`Remove ${item.productName} from bag`}
                      className="text-xs text-[#6B6B6B] hover:text-[#111111] p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E8E6E1]">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="px-2 py-1 text-xs hover:bg-[#F3F2EF] transition-colors min-w-[28px]"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-normal border-x border-[#E8E6E1]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="px-2 py-1 text-xs hover:bg-[#F3F2EF] transition-colors min-w-[28px]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-[13px] font-normal text-[#111111]">
                      {formatINR(item.unitPricePaise * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Summary */}
          <div className="border-t border-[#E8E6E1] pt-4 flex flex-col gap-3">
            <div className="flex justify-between text-xs text-[#6B6B6B]">
              <span>Subtotal</span>
              <span className="text-[#111111]">{formatINR(subtotalPaise)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#6B6B6B]">
              <span>Estimated shipping</span>
              <span className="text-[#111111]">{shippingPaise === 0 ? 'Free' : formatINR(shippingPaise)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium border-t border-[#E8E6E1] pt-2 text-[#111111]">
              <span>Total</span>
              <span>{formatINR(totalPaise)}</span>
            </div>

            <p className="text-[11px] text-[#6B6B6B] text-center">
              {CONFIG.taxes.gstInclusiveNote}
            </p>

            <Link href="/checkout" onClick={closeCart} className="w-full mt-1">
              <Button variant="primary" fullWidth size="lg">
                Proceed to checkout
              </Button>
            </Link>

            <Link href="/cart" onClick={closeCart} className="w-full">
              <Button variant="ghost" fullWidth size="sm">
                View full bag
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
