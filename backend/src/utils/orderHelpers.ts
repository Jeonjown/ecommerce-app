import { getVariantById } from '../models/variantModel';
import { OrderItem } from '../types/models/orderItems';
import { ApiError } from './ApiError';
import { toCents } from './priceConverter';

export async function prepareOrderData(
  items: { productId: number; variantId: number; quantity: number }[]
): Promise<{
  totalPrice: number; // in cents
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

    const unitPrice = variant.price;
    const itemTotal = unitPrice * item.quantity;

    totalPrice += itemTotal;

    orderItems.push({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: unitPrice,
      name: variant.name,
    });
  }

  return { totalPrice, orderItems };
}
