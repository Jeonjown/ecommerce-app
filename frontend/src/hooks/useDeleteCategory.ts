import { deleteCategory } from "@/api/categoryApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (categoryId) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully.");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete category",
        );
      } else {
        toast.error(error.message || "Unexpected error");
      }
    },
  });
};
