import { getProducts } from "@/api/productsApi";
import type { ProductResponse } from "@/types/api/products";
import { useQuery } from "@tanstack/react-query";

export const useGetProducts = (
  filters?: Record<string, string | undefined>,
) => {
  return useQuery<ProductResponse>({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
