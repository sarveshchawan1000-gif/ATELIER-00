'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemState {
  variantId: string;
  productId: string;
  productName: string;
  colour: string;
  size: string;
  unitPricePaise: number;
  quantity: number;
  imageUrl: string;
}

interface CartStore {
  items: CartItemState[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: CartItemState) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotalPaise: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [
        // Demo items matching initial seed for UI testing
        {
          variantId: 'v-1',
          productId: 'p-1',
          productName: 'OVERSIZED COTTON TEE',
          colour: 'WASHED BLACK',
          size: 'M',
          unitPricePaise: 499900, // ₹4,999 INR
          quantity: 1,
          imageUrl: '/assets/seed/tee-front.webp',
        },
        {
          variantId: 'v-2',
          productId: 'p-2',
          productName: 'HEAVYWEIGHT ZIP HOODIE',
          colour: 'RAW CREAM',
          size: 'L',
          unitPricePaise: 899900, // ₹8,999 INR
          quantity: 1,
          imageUrl: '/assets/seed/hoodie-front.webp',
        },
      ],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.variantId === newItem.variantId);
        if (existingIndex > -1) {
          const updated = [...currentItems];
          const newQty = Math.min(updated[existingIndex].quantity + newItem.quantity, 10);
          updated[existingIndex].quantity = newQty;
          set({ items: updated, isOpen: true });
        } else {
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },
      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.min(quantity, 10) } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getSubtotalPaise: () => get().items.reduce((acc, item) => acc + item.unitPricePaise * item.quantity, 0),
    }),
    {
      name: 'brand_cart_v1',
    }
  )
);
