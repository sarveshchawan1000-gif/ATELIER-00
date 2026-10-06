'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItemState {
  productId: string;
  productName: string;
  mrpPaise: number;
  salePricePaise?: number;
  imageUrl: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItemState[];
  toggleWishlist: (item: WishlistItemState) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [
        {
          productId: 'p-1',
          productName: 'OVERSIZED COTTON TEE',
          mrpPaise: 499900,
          imageUrl: '/assets/seed/tee-front.webp',
          slug: 'oversized-cotton-tee',
        },
      ],
      toggleWishlist: (item) => {
        const exists = get().isInWishlist(item.productId);
        if (exists) {
          set({ items: get().items.filter((i) => i.productId !== item.productId) });
          return false;
        } else {
          set({ items: [...get().items, item] });
          return true;
        }
      },
      isInWishlist: (productId) => get().items.some((i) => i.productId === productId),
      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      clearWishlist: () => set({ items: [] }),
      getItemCount: () => get().items.length,
    }),
    {
      name: 'brand_wishlist_v1',
    }
  )
);
