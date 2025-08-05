import { getProductBySlug } from "@/api/productsApi";
import type { Product, ProductOption, Variant } from "@/types/api/products";
import { useQuery } from "@tanstack/react-query";

export const useGetProductBySlug = (slug: string) => {
  return useQuery<{
    product: Product;
    options: ProductOption[];
    variants: Variant[];
  }>({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};
