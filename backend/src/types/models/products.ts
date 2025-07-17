export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  image_url: string;
  slug: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  option1: string;
  option2: string;
  option3: string;
  price: string;
  stock: number;
  sku: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}
