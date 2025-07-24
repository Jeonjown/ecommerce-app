// hooks/useDeleteVariant.ts
import { deleteVariantById } from "@/api/variantApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteVariantById = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVariantById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["variants", productId],
      });
      toast.success(data.message || "Variant deleted successfully");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete variant failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
