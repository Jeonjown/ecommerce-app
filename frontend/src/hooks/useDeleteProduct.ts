import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/api/productsApi";
import { toast } from "sonner";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product.");
    },
  });
};
