import { updateVariantById } from "@/api/variantApi";
import type { UpdateVariantPayload } from "@/types/api/variant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateVariantById = (product_id: number) => {
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
      queryClient.invalidateQueries({ queryKey: ["variants", product_id] });
      toast.success("Variant updated successfully!");
    },

    onError: (error: Error) => {
      console.error("Error updating variant:", error.message);
      toast.error(`Failed to update variant: ${error.message}`);
    },
  });
};
