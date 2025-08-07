import { addItemToCart } from "@/api/cartApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addItemToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item added to cart!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add item.");
    },
  });
};
