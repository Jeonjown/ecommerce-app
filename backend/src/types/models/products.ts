import { Category } from './categories';

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  variants?: ProductVariant[];
  options?: ProductOptionWithValues[];
}

export interface ProductWithCategory {
  id: number;
  category: Category;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  variants: ProductVariant[];
  options: ProductOptionWithValues[];
}

export interface ProductWithVariantsAndOptions {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  variants: ProductVariantWithOptions[];
  options: GroupedProductOption[];
}

export interface ProductVariantWithOptions extends ProductVariant {
  options: VariantOption[]; // required
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  options?: VariantOption[];
}

export interface VariantOption {
  option_id: number;
  option_name: string;
  option_value_id: number;
  option_value: string;
}

export interface GroupedProductOption {
  id: number;
  name: string;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: number;
  value: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  options?: VariantOption[];
}

export interface VariantOption {
  option_id: number;
  option_name: string;
  option_value_id: number;
  option_value: string;
}

export interface ProductOptionWithValues {
  option_id: number;
  option_name: string;
  option_value_id: number;
  option_value: string;
}

export interface ProductFilters {
  sort?: string;
  availability?: string;
  priceRange?: string;
}
