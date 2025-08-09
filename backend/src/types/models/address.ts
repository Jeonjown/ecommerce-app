export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default: number;
  created_at: Date;
}
