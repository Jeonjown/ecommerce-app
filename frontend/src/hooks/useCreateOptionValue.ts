import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { createOptionValue } from "@/api/optionsValueApi";

export const useCreateOptionValue = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOptionValue,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["optionsByProductId", productId],
      });
      toast.success(data.message || "Option Created successfully");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Creating options failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
