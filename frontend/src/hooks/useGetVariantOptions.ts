import { useQuery } from "@tanstack/react-query";
import { getVariantOptions } from "@/api/variantApi";
import type { VariantOption } from "@/types/api/products";

export const useGetVariantOptions = (variantId: number) => {
  return useQuery<VariantOption[]>({
    queryKey: ["variant-options", variantId],
    queryFn: () => getVariantOptions(variantId),
    enabled: !!variantId,
  });
};
