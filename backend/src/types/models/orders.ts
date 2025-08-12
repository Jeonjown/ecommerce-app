export interface Orders {
  id: number;
  user_id: number;
  payment_method: PaymentMethod;
  total_price: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  delivery_address: string;
  updated_at: Date;
  created_at: Date;
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  ONLINE = 'online',
  COD = 'cod',
}
