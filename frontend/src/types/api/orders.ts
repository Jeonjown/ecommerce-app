export interface OrderPayload {
  deliveryAddress: string;
  paymentMethod: string;
  items: {
    productId: number;
    variantId: number;
    quantity: number;
  }[];
}
