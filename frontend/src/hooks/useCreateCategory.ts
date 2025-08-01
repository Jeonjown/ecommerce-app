import { createCategory } from "@/api/categoryApi";
import type { Category } from "@/types/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

interface CreateCategoryWithReset {
  name: string;
  reset?: () => void;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryWithReset>({
    mutationFn: ({ name }) => createCategory(name),
    onSuccess: (category, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Category "${category.name}" created successfully.`);
      variables.reset?.();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create category",
        );
      } else {
        toast.error(error.message || "Unexpected error");
      }
    },
  });
};
