export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  stock: number;
  price: number;
  image_url: string;
  description: string | null;

  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
