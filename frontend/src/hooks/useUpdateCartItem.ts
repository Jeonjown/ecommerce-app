import { updateCartItem } from "@/api/cartApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CartItem } from "@/types/api/cart";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,

    // ✅ Optimistic update
    onMutate: async (updatedItem: CartItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<CartItem[]>(["cart"]);

      // Optimistically update the cache
      if (previousCart) {
        queryClient.setQueryData<CartItem[]>(
          ["cart"],
          (old) =>
            old?.map((item) =>
              item.variant_id === updatedItem.variant_id
                ? { ...item, quantity: updatedItem.quantity }
                : item,
            ) ?? [],
        );
      }

      return { previousCart };
    },

    // ❌ If error, rollback
    onError: (_err, _updatedItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },

    // ✅ Always refetch to sync with backend
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
