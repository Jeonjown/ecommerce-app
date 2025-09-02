import { ProductWithCategory } from '../types/models/products';

export function getLowestPrice(product: ProductWithCategory): number {
  const prices = (product.variants ?? []).map((v) => Number(v.price));
  const lowest = Math.min(...prices);
  return lowest;
}
