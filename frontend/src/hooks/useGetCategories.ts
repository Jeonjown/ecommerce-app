import { getCategories } from "@/api/categoryApi";
import type { Categories } from "@/types/api/categories";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  return useQuery<Categories>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
