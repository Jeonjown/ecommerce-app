import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Address } from "@/types/api/address";
import { createAddress } from "@/api/addressApi";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAddress: Omit<Address, "id" | "created_at" | "user_id">) =>
      createAddress(newAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: unknown) => {
      console.error("Create address error:", error);
    },
  });
};
