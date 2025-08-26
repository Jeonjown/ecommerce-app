import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { createOptionValue } from "@/api/optionsValueApi";

export const useCreateOptionValue = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOptionValue,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["product_options", productId],
      });
      toast.success(data.message || "Option value created successfully");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Creating option value failed",
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
