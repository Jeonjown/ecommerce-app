// src/hooks/useProductsWithFilters.ts
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useGetProductsByCategorySlug } from "./useGetProductsByCategorySlug";
import { useGetProducts } from "./useGetProducts";

export const useProductsWithFilters = (slug?: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? "";
  const priceRange = searchParams.get("priceRange") ?? "";

  const filters = useMemo(
    () => ({
      sort: sort || undefined,
      priceRange: priceRange || undefined,
    }),
    [sort, priceRange],
  );

  const {
    data: categoryProducts,
    isPending: isCategoryLoading,
    isError: isCategoryError,
  } = useGetProductsByCategorySlug(slug ?? "", filters);

  const {
    data: allProducts,
    isPending: isAllLoading,
    isError: isAllError,
  } = useGetProducts(filters);

  const isPending = slug ? isCategoryLoading : isAllLoading;
  const isError = slug ? isCategoryError : isAllError;
  const products = slug
    ? (categoryProducts?.products ?? [])
    : (allProducts?.products ?? []);

  const setFilterParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "default") newParams.delete(key);
    else newParams.set(key, value);
    newParams.set("page", "1"); // reset page when filter changes
    setSearchParams(newParams, { replace: true });
  };

  return { products, isPending, isError, filters, setFilterParam };
};
