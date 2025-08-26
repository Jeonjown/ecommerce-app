import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { createOptionByProductId } from "@/api/optionsApi";

export const useCreateOptions = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createOptionByProductId(productId, name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["product_options", productId],
      });
      toast.success(data.message || "Option created successfully");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Creating option failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
