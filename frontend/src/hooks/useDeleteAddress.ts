import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddress } from "@/api/addressApi";

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
