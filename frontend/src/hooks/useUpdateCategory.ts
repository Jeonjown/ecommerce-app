import { editCategory } from "@/api/categoryApi";
import type { Category } from "@/types/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface UpdateCategoryPayload {
  id: number;
  name: string;
  reset?: () => void;
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, UpdateCategoryPayload>({
    mutationFn: ({ id, name }) => editCategory(id, name),
    onSuccess: (category, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Category "${category.name}" updated successfully.`);
      variables.reset?.();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update category",
        );
      } else {
        toast.error(error.message || "Unexpected error");
      }
    },
  });
};
