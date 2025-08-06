import type { CartItem } from "@/types/api/cart";

const getTotalPrice = (items: CartItem[]) => {
  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
};

export default getTotalPrice;
