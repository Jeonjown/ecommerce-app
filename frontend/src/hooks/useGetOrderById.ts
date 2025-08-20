import { useQuery } from "@tanstack/react-query";

import type { OrderResponse } from "@/types/api/orders";
import { getOrderById } from "@/api/orderApi";

export const useGetOrderById = (orderId: number) => {
  return useQuery<OrderResponse, Error>({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId, // only fetch if orderId is valid
  });
};
