import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress } from "@/api/addressApi";
import type { Address } from "@/types/api/address";

export const useEditAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Address> }) =>
      updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
