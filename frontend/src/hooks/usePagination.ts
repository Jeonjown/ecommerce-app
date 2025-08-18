// src/hooks/usePagination.ts
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const usePagination = (totalItems: number, perPage: number) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page") ?? "1");

  const [currentPage, setCurrentPage] = useState(
    isNaN(pageParam) || pageParam < 1 ? 1 : pageParam,
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  // sync currentPage with URL
  useEffect(() => {
    const p = Number(searchParams.get("page") ?? "1");
    const normalized = isNaN(p) || p < 1 ? 1 : p;
    if (normalized !== currentPage) setCurrentPage(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // update URL when currentPage changes
  useEffect(() => {
    const pageInUrl = Number(searchParams.get("page") ?? "1");
    if (pageInUrl !== currentPage) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", String(currentPage));
      setSearchParams(newParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const makePageHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    const p = Math.max(1, Math.min(page, totalPages));
    params.set("page", String(p));
    return `?${params.toString()}`;
  };

  return { currentPage, totalPages, setCurrentPage, makePageHref };
};
