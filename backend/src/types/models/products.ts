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
