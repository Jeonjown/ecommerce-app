import { useQuery } from "@tanstack/react-query";
import { getCartItemsByLoggedUser } from "@/api/cartApi";

export const useGetUserCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartItemsByLoggedUser,
  });
};
