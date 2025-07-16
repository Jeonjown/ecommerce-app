export interface ProductVariant {
  id: number;
  product_id: number;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  price: number;
  stock: number;
  sku: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  image_url: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
}
