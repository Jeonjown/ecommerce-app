import { getVariantById } from '../models/variantModel';
import { ApiError } from './ApiError';

export async function prepareOrderData(items: any[]) {
  let totalPrice = 0;
  const preparedItems = [];

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

    preparedItems.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: variant.price,
      totalPrice: itemTotal,
    });
  }

  return { totalPrice, preparedItems };
}
