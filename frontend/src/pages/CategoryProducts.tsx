// src/components/CategoryProducts.tsx
import { useState } from "react";
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

export default function CategoryProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOrder = searchParams.get("sort") ?? "";
  const priceRange = searchParams.get("priceRange") ?? "";

  const { slug } = useParams<{ slug?: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const filters = {
    sort: sortOrder || undefined,
    priceRange,
  };

  const {
    data: categoryProducts,
    isPending: isCategoryLoading,
    isError: isCategoryError,
  } = useGetProductsByCategorySlug(slug!, filters);

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

  // pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
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

  // loading skeleton
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="mb-6">
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">
          {slug && products[0]?.category
            ? products[0].category.name
            : "All Products"}
        </h2>
        <Filters
          sortOrder={sortOrder}
          priceRange={priceRange}
          onSortChange={(value) => {
            searchParams.set("sort", value);
            setSearchParams(searchParams);
            setCurrentPage(1);
          }}
          onPriceRangeChange={(value) => {
            searchParams.set("priceRange", value);
            setSearchParams(searchParams);
            setCurrentPage(1);
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
