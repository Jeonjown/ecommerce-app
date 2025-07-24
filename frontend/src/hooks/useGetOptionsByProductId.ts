import { getOptionsByProductId } from "@/api/optionsApi";
import type { OptionResponse } from "@/types/api/options";

import { useQuery } from "@tanstack/react-query";

export const useGetOptionsByProductId = (id: number) => {
  return useQuery<OptionResponse>({
    queryKey: ["optionsByProductId", id],
    queryFn: () => getOptionsByProductId(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
