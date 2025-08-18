// src/components/CategoryProducts.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { useGetProductsByCategorySlug } from "@/hooks/useGetProductsByCategorySlug";
import { useGetProducts } from "@/hooks/useGetProducts";

import { ProductCard } from "@/components/ProductCard";
import Error from "./Error";

import { Box } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Filters from "@/components/Filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CategoryProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOrder = searchParams.get("sort") ?? "";
  const priceRange = searchParams.get("priceRange") ?? "";
  const pageParam = Number(searchParams.get("page") ?? "1");

  const { slug } = useParams<{ slug?: string }>();

  // Keep current page in state but initialize from URL param.
  const [currentPage, setCurrentPage] = useState<number>(
    isNaN(pageParam) || pageParam < 1 ? 1 : pageParam,
  );
  const productsPerPage = 9;

  // Use raw priceRange (e.g. "0-500") — no conversion to cents here.
  const filters = useMemo(
    () => ({
      sort: sortOrder || undefined,
      priceRange: priceRange || undefined,
    }),
    [sortOrder, priceRange],
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

  const isLoading = slug ? isCategoryLoading : isAllLoading;
  const isErrorState = slug ? isCategoryError : isAllError;

  const products = slug
    ? (categoryProducts?.products ?? [])
    : (allProducts?.products ?? []);

  // compute total pages (allow 1 minimum so pagination UI is consistent)
  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));

  // Ensure currentPage is within bounds whenever totalPages or products change
  useEffect(() => {
    if (products.length === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1);
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", "1");
        setSearchParams(newParams);
      }
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", String(totalPages));
      setSearchParams(newParams);
    } else if (currentPage < 1) {
      setCurrentPage(1);
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
      setSearchParams(newParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, products.length]);

  // Reset page to 1 when user navigates to a different category or changes filters
  useEffect(() => {
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    setSearchParams(newParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, sortOrder, priceRange]);

  // update URL param when currentPage changes (so state persists via URL)
  useEffect(() => {
    const p = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(p));
    setSearchParams(newParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // helper to update searchParams from Filters (keeps other params intact)
  const setFilterParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "default") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    // reset page when filter changes
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  // loading skeleton
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="">
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: productsPerPage }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-50 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isErrorState) return <Error />;

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">
          {slug && products[0]?.category
            ? products[0].category.name
            : "All Products"}
        </h2>

        <Filters
          sortOrder={sortOrder}
          priceRange={priceRange}
          onSortChange={(value) => {
            // treat "default" or empty as clearing the param
            setFilterParam("sort", value);
          }}
          onPriceRangeChange={(value) => {
            setFilterParam("priceRange", value);
          }}
        />
      </div>

      {products.length === 0 ? (
        <div className="text-muted-foreground flex h-[60vh] flex-col items-center justify-center p-10">
          <Box className="mb-2 h-10 w-10" />
          <p>No products found for this category.</p>
        </div>
      ) : (
        <>
          <Breadcrumb className="mb-5 hidden md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
