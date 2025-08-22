import { getOrdersByUserId } from "@/api/orderApi";
import { useQuery } from "@tanstack/react-query";

export const useGetOrdersByUserId = (userId: number) => {
  return useQuery({
    queryKey: ["orders", "user", userId],
    queryFn: () => getOrdersByUserId(userId),
    enabled: !!userId,
  });
};
