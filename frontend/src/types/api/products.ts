import type { Category } from "./categories";

export interface ProductResponse {
  products: ProductWithCategory[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id?: number;
  slug: string;
  is_active: boolean;
  variants: Variant[];
  options: ProductOption[];
}

export interface ProductWithCategory {
  id: number;
  name: string;
  description: string;
  category: Category;
  slug: string;
  is_active: boolean;
  created_at: Date;
  options: ProductOption[];
  variants: Variant[];
}

export interface Variant {
  id: number;
  product_id: number;
  sku: string;
  price: string;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  options: VariantOption[];
}

export interface VariantOption {
  option_id: number;
  option_name: string;
  values: {
    value_id: number;
    value_name: string;
  }[];
}

export interface ProductVariantWithOptions {
  id: number;
  product_id: number;
  sku: string;
  price: number | string;
  stock: number;
  image_url: string;
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
  options: VariantOption[];
}

export interface ProductOption {
  option_id: number;
  option_name: string;
  option_value_id: number;
  option_value: string;
}

export interface CreateProductRequest {
  category_id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface CreateProductResponse {
  message: string;
  product: Product;
}

export interface UpdateProductPayload {
  category_id: number;
  name: string;
  description: string;
  is_active: boolean;
}
