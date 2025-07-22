import { createProduct } from "@/api/productsApi";
import type {
  CreateProductRequest,
  CreateProductResponse,
} from "@/types/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface CreateProductWithReset {
  data: CreateProductRequest;
  reset?: () => void;
}

export const useCreateProducts = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateProductResponse, Error, CreateProductWithReset>({
    mutationFn: ({ data }) => createProduct(data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(response.message);
      variables.reset?.();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create product",
        );
      } else {
        toast.error(error.message || "Unexpected error");
      }
    },
  });
};
