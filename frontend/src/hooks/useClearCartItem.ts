import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearCartItem } from "@/api/cartApi";
import { toast } from "sonner";

export const useClearCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to clear cart");
      }
    },
  });
};
