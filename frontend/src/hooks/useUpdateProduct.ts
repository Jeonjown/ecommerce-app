import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ProductResponse } from "@/types/api/products";
import type { UpdateProductPayload } from "@/types/api/products";
import { toast } from "sonner";
import { updateProduct } from "@/api/productsApi";

export const useUpdateProduct = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, Error, UpdateProductPayload>({
    mutationFn: (payload) => updateProduct(productId, payload),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
      console.error("Update product error:", error.message);
    },
  });
};
