import { getOrdersByLoggedInUser } from "@/api/orderApi";
import { useQuery } from "@tanstack/react-query";

export const useGetOrdersByLoggedInUser = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersByLoggedInUser,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};
