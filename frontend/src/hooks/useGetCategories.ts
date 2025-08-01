import { getCategories } from "@/api/categoryApi";
import type { Category } from "@/types/api/categories";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  return useQuery<{ categories: Category[] }>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
