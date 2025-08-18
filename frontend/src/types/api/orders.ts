export interface OrderPayload {
  deliveryAddress: string;
  paymentMethod: string;
  items: {
    productId: number;
    variantId: number;
    quantity: number;
  }[];
}

export interface PaymentDetails {
  id: string;
  status: string;
  currency: string;
  card_brand: string | null;
  card_last4: string | null;
  receipt_url: string | null;
  payment_method: string;
  amount_received: number;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  user_id: number;
  payment_method: "cod" | "online";
  payment_status: "unpaid" | "paid" | "pending" | "failed" | "refunded";
  order_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  refund_status:
    | "none"
    | "requested"
    | "processing"
    | "completed"
    | "rejected"
    | null;
  order_total: number; // cents
  delivery_address: string;

  product_id: number;
  variant_id: number;
  quantity: number;
  unit_price: number; // cents
  product_name: string;
  product_brand: string;
  variant_name: string;
  variant_sku: string;
  variant_price: number; // cents
  variant_image: string;
  created_at: Date;
}

export interface Order {
  order_id: number;
  user_id: number;
  payment_method: "cod" | "online";
  payment_status: "unpaid" | "paid" | "pending" | "failed" | "refunded";
  order_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  refund_status:
    | "none"
    | "requested"
    | "processing"
    | "completed"
    | "rejected"
    | null;
  order_total: number; // cents
  delivery_address: string;
  items: OrderItem[];
  created_at: Date;
}

export interface OrdersResponse {
  orders: Order[];
}
