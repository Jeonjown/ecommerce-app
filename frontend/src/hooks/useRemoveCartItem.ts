import { removeCartItem } from "@/api/cartApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
