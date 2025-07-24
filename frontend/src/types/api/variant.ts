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
  product_id: number;
  price: number;
  stock: number;
  is_active: boolean;
  image_url: string;
  variant_options: {
    product_option_id: number;
    product_option_value_id: number;
  }[];
}
