import type { ProductWithCategory } from "@/types/api/products";

export function getLowestPrice(product: ProductWithCategory): number {
  const prices = (product.variants ?? []).map((v) => Number(v.price));
  const lowest = Math.min(...prices);
  console.log(product.name, prices, lowest);
  return lowest;
}
