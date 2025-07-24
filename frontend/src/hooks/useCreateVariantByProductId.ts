import { createVariantByProductId } from "@/api/variantApi";
import type { CreateVariantPayload } from "@/types/api/variant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateVariantByProductId = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVariantPayload) => {
      return createVariantByProductId(productId, payload);
    },
    onSuccess: () => {
      toast.success("Variant created successfully");
      queryClient.invalidateQueries({
        queryKey: ["variants", productId],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create variant");
    },
  });
};
