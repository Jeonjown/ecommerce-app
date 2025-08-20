import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/api/orderApi";
import type { OrderResponse } from "@/types/api/orders";

export const useGetAllOrders = () => {
  return useQuery<OrderResponse[], Error>({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    staleTime: 1000 * 60,
  });
};
