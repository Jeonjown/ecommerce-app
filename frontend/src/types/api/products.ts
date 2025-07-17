export interface ProductResponse {
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  is_active: number;
  slug: string;
  variants: Variant[];
}

export interface Variant {
  id: number;
  product_id: number;
  option1: string;
  option2: string;
  option3: string;
  price: string;
  stock: number;
  is_active: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  sku: string;
}
