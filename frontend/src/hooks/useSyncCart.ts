import { syncUserCart } from "@/api/cartApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSyncCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncUserCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
