import { getProducts } from "@/api/productsApi";
import type { ProductResponse } from "@/types/api/products";
import { useQuery } from "@tanstack/react-query";

export const useGetProducts = () => {
  return useQuery<ProductResponse>({
    queryKey: ["products"],
    queryFn: getProducts,
    retry: false,
    refetchOnWindowFocus: false, // no refetch when tab focused
  });
};
