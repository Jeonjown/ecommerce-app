import { getCategoryById } from "@/api/categoryApi";
import type { Category } from "@/types/api/categories";

import { useQuery } from "@tanstack/react-query";

export const useGetCategoryById = (id: number) => {
  return useQuery<Category>({
    queryKey: ["categoryById", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
