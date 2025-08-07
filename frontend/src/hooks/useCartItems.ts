import { getCartItemsByLoggedUser } from "@/api/cartApi";
import { useQuery } from "@tanstack/react-query";

export const useCartItems = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartItemsByLoggedUser,
  });
};
