import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddress } from "@/api/addressApi";
import type { Address } from "@/types/api/address";

type Variables = { id: number; payload: Partial<Address> };
type Response = { message: string };
type ErrorType = Error;

export const useEditAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, ErrorType, Variables>({
    mutationFn: ({ id, payload }) => updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
