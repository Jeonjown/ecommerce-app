import { getOrdersByUserId } from "@/api/orderApi";
import { useQuery } from "@tanstack/react-query";

export const useGetOrdersByUserId = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersByUserId,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};
