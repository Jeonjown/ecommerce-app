import { createVariantByProductId } from "@/api/variantApi";
import type { CreateVariantPayload } from "@/types/api/variant";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateVariantByProductId = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVariantPayload) =>
      createVariantByProductId(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variants", productId],
      });
    },
  });
};
