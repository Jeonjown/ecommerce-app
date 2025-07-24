export interface Variants {
  variants: Variant[];
}

export interface Variant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateVariantPayload {
  price: number;
  stock: number;
  image_url: string;
  is_active?: boolean;
  options?: { name: string; value: string }[];
}
