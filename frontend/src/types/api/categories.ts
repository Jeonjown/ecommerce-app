export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export interface Categories {
  categories: Category[];
}
