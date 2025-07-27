import { updateVariantById } from "@/api/variantApi";
import type { UpdateVariantPayload } from "@/types/api/variant";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateVariantById = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateVariantPayload;
    }) => updateVariantById(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variants", productId] });
    },
    onError: (error: Error) => {
      console.error("Error updating variant:", error.message);
    },
  });
};
