export interface OptionValueResponse {
  message: string;
  optionValue: OptionValue;
}

export interface CreateOptionValueRequest {
  id: number;
  value: string;
}

export interface OptionValue {
  id: number;
  product_option_id: number;
  value: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}
