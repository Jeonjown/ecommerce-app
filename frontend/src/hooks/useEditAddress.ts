import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress } from "@/api/addressApi";
import type { Address } from "@/types/api/address";

export const useEditAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Address> }) =>
      updateAddress(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["addresses"] });

      const previousAddresses = queryClient.getQueryData<Address[]>([
        "addresses",
      ]);

      queryClient.setQueryData<Address[]>(["addresses"], (old) => {
        if (!old) return old;
        return old.map((addr) =>
          addr.id === id ? { ...addr, ...payload } : addr,
        );
      });

      // Return context for rollback
      return { previousAddresses };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(["addresses"], context.previousAddresses);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
