import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { deleteOptionByOptionId } from "@/api/optionsApi";

export const useDeleteOptionByOptionId = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOptionByOptionId(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["optionsByProductId", productId],
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
