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

export interface OrderItemResponse {
  order_item_id: number;
  quantity: number;
  unit_price: number; // cents
  product_id: number;
  product_name: string;
  brand: string;
  variant_id: number;
  sku: string;
  variant_name: string;
  image_url: string;
  variant_price: number; // cents
}

export interface OrderResponse {
  order_id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
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
  total_price: number; // cents
  delivery_address: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  payment_details: PaymentDetails | null; // reuse your existing PaymentDetails
  order_date: string; // ISO string
  last_updated: string; // ISO string
  items: OrderItemResponse[];
}

export interface OrderRow {
  order_id: number;
  user_id: number;
  payment_method: "cod" | "online";
  payment_status: "unpaid" | "pending" | "paid" | "failed" | "refunded" | null;
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
  order_total: number;
  delivery_address: string;
  created_at: string;
  order_item_id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
  product_name: string;
  product_brand: string;
  variant_name: string;
  variant_sku: string;
  variant_price: number;
  variant_image?: string;
}

export interface CancelOrderPayload {
  reason: string;
}

export interface CancelOrderResponse {
  message: string;
  orderId: number;
  reason: string;
}
