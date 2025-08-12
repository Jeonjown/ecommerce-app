import { getVariantById } from '../models/variantModel';
import { ApiError } from './ApiError';
import type { OrderItem } from '../types/models/orderItems';

export async function prepareOrderData(
  items: { productId: number; variantId: number; quantity: number }[]
): Promise<{
  totalPrice: number;
  orderItems: Omit<OrderItem, 'id' | 'order_id'>[];
}> {
  let totalPrice = 0;
  const orderItems: Omit<OrderItem, 'id' | 'order_id'>[] = [];

  for (const item of items) {
    const variant = await getVariantById(item.variantId);

    if (!variant) {
      throw new ApiError(
        `No item found with variantId: ${item.variantId}`,
        404
      );
    }

    if (variant.stock === 0 || item.quantity > variant.stock) {
      throw new ApiError(
        `Insufficient stock for variantId: ${item.variantId}`,
        400
      );
    }

    const itemTotal = variant.price * item.quantity;
    totalPrice += itemTotal;

    orderItems.push({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: variant.price,
      name: variant.name,
    });
  }

  return { totalPrice, orderItems };
}
