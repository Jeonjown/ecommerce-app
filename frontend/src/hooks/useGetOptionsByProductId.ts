import { useQuery } from "@tanstack/react-query";
import { getOptionsByProductId } from "@/api/optionsApi";
import type { OptionResponse } from "@/types/api/options";

export const useGetOptionsByProductId = (productId: number) => {
  return useQuery<OptionResponse>({
    queryKey: ["product_options", productId],
    queryFn: () => getOptionsByProductId(productId),
    enabled: !!productId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
