export interface Variants {
  variants: Variant[];
}

export type Variant = {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
};

export type CreateVariantPayload = {
  product_id: number;
  sku?: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  name: string;
  description: string;
  variant_options: {
    product_option_id: number;
    product_option_value_id: number;
  }[];
};

export type UpdateVariantPayload = {
  sku: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  name: string;
  description: string;
};
