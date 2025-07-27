import { useQuery } from "@tanstack/react-query";
import { getVariantById } from "@/api/variantApi";
import type { Variant } from "@/types/api/variant";

export const useGetVariantById = (variantId: number) => {
  return useQuery<Variant, Error>({
    queryKey: ["variants"],
    queryFn: () => getVariantById(variantId as number),
    enabled: !!variantId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
