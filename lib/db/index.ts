import { Category, Collection, ProductWithDetails } from './types';
import { SEED_CATEGORIES, SEED_COLLECTIONS, SEED_PRODUCTS } from './seed-data';

export async function getCategories(): Promise<Category[]> {
  // In production, queries Supabase table 'categories'
  return SEED_CATEGORIES;
}

export async function getCollections(): Promise<Collection[]> {
  // In production, queries Supabase table 'collections'
  return SEED_COLLECTIONS;
}

export async function getProducts(options?: {
  categorySlug?: string;
  collectionSlug?: string;
  gender?: string;
  searchQuery?: string;
  sortBy?: 'recommended' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  page?: number;
  limit?: number;
}): Promise<{ products: ProductWithDetails[]; total: number }> {
  let filtered = [...SEED_PRODUCTS];

  if (options?.categorySlug) {
    filtered = filtered.filter((p) => p.category.slug === options.categorySlug);
  }

  if (options?.collectionSlug) {
    filtered = filtered.filter((p) =>
      p.collections.some((c) => c.slug === options.collectionSlug)
    );
  }

  if (options?.gender) {
    const g = options.gender.toLowerCase();
    filtered = filtered.filter((p) => p.gender === g || p.tags.includes(g));
  }

  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (options?.sortBy === 'price-asc') {
    filtered.sort((a, b) => (a.sale_price || a.mrp) - (b.sale_price || b.mrp));
  } else if (options?.sortBy === 'price-desc') {
    filtered.sort((a, b) => (b.sale_price || b.mrp) - (a.sale_price || a.mrp));
  } else if (options?.sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (options?.sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0));
  }

  const page = options?.page || 1;
  const limit = options?.limit || 24;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    products: paginated,
    total: filtered.length,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const product = SEED_PRODUCTS.find((p) => p.slug === slug);
  return product || null;
}

export async function getRelatedProducts(productId: string, categoryId: string): Promise<ProductWithDetails[]> {
  return SEED_PRODUCTS.filter((p) => p.id !== productId && p.category_id === categoryId).slice(0, 4);
}
