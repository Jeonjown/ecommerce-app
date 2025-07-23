import { getVariantsByProductId } from "@/api/variantApi";
import type { Variant } from "@/types/api/variant";
import { useQuery } from "@tanstack/react-query";

export const useGetVariantsbyProductId = (product_id: number) => {
  return useQuery<Variant[], Error, Variant[]>({
    queryKey: ["variants", product_id],
    queryFn: () => getVariantsByProductId(product_id), // pass ID correctly
    enabled: !!product_id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
