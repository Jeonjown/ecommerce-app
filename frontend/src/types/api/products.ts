import type { Category } from "./categories";

export interface ProductResponse {
  products: ProductWithCategory[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  slug: string;
  is_active: boolean;
  // variants: Variant[];
  // options: ProductOption[];
}

export interface ProductWithCategory {
  id: number;
  name: string;
  description: string;
  category: Category;
  slug: string;
  is_active: boolean;
  options: ProductOption[];
  // variants: Variant[];
  // options: ProductOption[];
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
  option_value_id: number;
  option_value: string;
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
