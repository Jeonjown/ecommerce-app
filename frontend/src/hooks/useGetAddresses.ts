import { useQuery } from "@tanstack/react-query";
import type { Address } from "@/types/api/address";
import { getAddresses } from "@/api/addressApi";

export const useGetAddresses = () => {
  return useQuery<{ addresses: Address[] }, Error>({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
