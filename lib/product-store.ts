'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductWithDetails } from './db/types';
import { SEED_PRODUCTS } from './db/seed-data';

interface ProductStore {
  customProducts: ProductWithDetails[];
  addCustomProduct: (product: ProductWithDetails) => void;
  updateProductPhoto: (productId: string, photoUrl: string, altText?: string) => void;
  deleteCustomProduct: (productId: string) => void;
  getAllProducts: () => ProductWithDetails[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      customProducts: [],
      addCustomProduct: (product) => {
        set((state) => {
          // Prepend new product, removing any existing with same id or slug
          const filtered = state.customProducts.filter(
            (p) => p.id !== product.id && p.slug !== product.slug
          );
          const updated = [product, ...filtered];
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('atelier_custom_products', JSON.stringify(updated));
            } catch (e) {
              // ignore storage quota error
            }
          }
          return { customProducts: updated };
        });
      },
      updateProductPhoto: (productId, photoUrl, altText) => {
        set((state) => {
          const target = get().getAllProducts().find((p) => p.id === productId);
          if (!target) return state;

          const updatedProduct: ProductWithDetails = {
            ...target,
            images: [
              {
                id: `img-${Date.now()}`,
                product_id: productId,
                url: photoUrl,
                alt_text: altText || `${target.name} photo added by atelier owner`,
                position: 1,
                is_primary: true,
              },
              ...target.images.filter((img) => !img.is_primary),
            ],
            updated_at: new Date().toISOString(),
          };

          const filtered = state.customProducts.filter((p) => p.id !== productId);
          const updated = [updatedProduct, ...filtered];
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('atelier_custom_products', JSON.stringify(updated));
            } catch (e) {}
          }
          return { customProducts: updated };
        });
      },
      deleteCustomProduct: (productId) => {
        set((state) => {
          const updated = state.customProducts.filter((p) => p.id !== productId);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('atelier_custom_products', JSON.stringify(updated));
            } catch (e) {}
          }
          return { customProducts: updated };
        });
      },
      getAllProducts: () => {
        const { customProducts } = get();
        const customIds = new Set(customProducts.map((p) => p.id));
        const customSlugs = new Set(customProducts.map((p) => p.slug));
        const remainingSeeds = SEED_PRODUCTS.filter(
          (p) => !customIds.has(p.id) && !customSlugs.has(p.slug)
        );
        return [...customProducts, ...remainingSeeds];
      },
    }),
    {
      name: 'atelier_owner_products_store',
    }
  )
);
