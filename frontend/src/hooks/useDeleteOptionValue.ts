import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { deleteOptionValue } from "@/api/optionsValueApi";

export const useDeleteOptionValue = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOptionValue,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["product_options", productId],
      });
      toast.success(data.message || "Option Deleted successfully");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete options failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
