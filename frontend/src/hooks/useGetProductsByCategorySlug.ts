import { getProductsByCategorySlug } from "@/api/categoryApi";
import type { ProductResponse } from "@/types/api/products";
import { useQuery } from "@tanstack/react-query";

export const useGetProductsByCategorySlug = (slug: string) => {
  return useQuery<ProductResponse>({
    queryKey: ["products", slug],
    queryFn: () => getProductsByCategorySlug(slug),
    enabled: !!slug,
  });
};
