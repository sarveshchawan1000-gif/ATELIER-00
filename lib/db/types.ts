/**
 * Database Entity Types & Interfaces
 * Authority: PRD v2.0 §10.2
 */

export type UserRole = 'customer' | 'owner' | 'manager' | 'support';

export interface Profile {
  id: string;
  name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  display_order: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_curated: boolean;
  display_order: number;
}

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  mrp: number; // Integer paise
  sale_price?: number; // Integer paise
  material: string;
  fit: string;
  care: string;
  weight_g: number;
  country_of_origin: string;
  gender?: 'male' | 'female' | 'kids' | 'unisex';
  tags: string[];
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  colour: string;
  colour_hex: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  stock: number;
  reserved_stock: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  colour?: string;
  url: string;
  alt_text: string;
  position: number;
  is_primary: boolean;
}

export interface ProductWithDetails extends Product {
  category: Category;
  collections: Collection[];
  variants: ProductVariant[];
  images: ProductImage[];
  rating_average?: number;
  rating_count?: number;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded'
  | 'payment_failed';

export interface Order {
  id: string;
  order_no: string;
  user_id?: string;
  email: string;
  phone: string;
  status: OrderStatus;
  subtotal: number; // paise
  shipping_fee: number; // paise
  discount: number; // paise
  total: number; // paise
  address_snapshot: Address;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  name_snapshot: string;
  size: string;
  colour: string;
  unit_price: number; // paise
  quantity: number;
}

export type ReviewStatus = 'pending' | 'approved' | 'hidden' | 'rejected';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_item_id: string;
  rating: number; // 1-5
  body: string;
  status: ReviewStatus;
  created_at: string;
  author_name?: string;
  images?: string[];
  is_verified?: boolean; // Derived server-side from order link
}
