import { getProductsByCategorySlug } from "@/api/categoryApi";
import type { ProductResponse } from "@/types/api/products";
import { useQuery } from "@tanstack/react-query";

export const useGetProductsByCategorySlug = (
  slug: string,
  filters: Record<string, string | undefined> = {},
) => {
  return useQuery<ProductResponse>({
    queryKey: ["products", slug, filters],
    queryFn: () => getProductsByCategorySlug(slug, filters),
    enabled: !!slug,
  });
};
