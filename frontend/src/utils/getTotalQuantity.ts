import type { CartItem } from "@/types/api/cart";

const getTotalQuantity = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export default getTotalQuantity;
