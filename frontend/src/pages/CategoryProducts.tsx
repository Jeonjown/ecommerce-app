import NoProducts from "@/components/NoProducts";
import PaginationUI from "@/components/PaginationUi";
import ProductBreadCrumbs from "@/components/ProductBreadCrumbs";
import ProductGrid from "@/components/ProductGrid";
import ProductHeader from "@/components/ProductHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { useProductsWithFilters } from "@/hooks/useProductsWithFilters";
import { useParams } from "react-router-dom";

const PRODUCTS_PER_PAGE = 9;

export const CategoryProducts = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { products, isPending, isError, filters, setFilterParam } =
    useProductsWithFilters(slug);

  const { currentPage, totalPages, makePageHref } = usePagination(
    products.length,
    PRODUCTS_PER_PAGE,
  );

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  if (isPending) {
    return (
      <div className="space-y-6 p-4">
        {/* ProductHeader skeleton */}
        <div className="mt-2 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category name */}
          <Skeleton className="h-8 w-40" />

          {/* Filters (sort + price) */}
          <div className="flex gap-4">
            <Skeleton className="h-8 w-28 rounded-md" /> {/* Sort */}
            <Skeleton className="h-8 w-32 rounded-md" /> {/* Price */}
          </div>
        </div>

        {/* Breadcrumbs skeleton */}
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-4 w-12" /> {/* Home */}
          <Skeleton className="h-4 w-16" /> {/* Category */}
          <Skeleton className="h-4 w-20" /> {/* Subcategory */}
        </div>

        {/* ProductGrid skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col space-y-3 rounded-xl border p-4 shadow-sm"
            >
              {/* Image */}
              <Skeleton className="h-48 w-full rounded-lg" />

              {/* Product name */}
              <Skeleton className="h-5 w-3/4" />

              {/* Price */}
              <Skeleton className="h-4 w-1/2" />

              {/* Extra line (brand/category) */}
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-500">Something went wrong.</div>;
  }

  return (
    <div className="p-4">
      <ProductHeader
        categoryName={slug && products[0]?.category?.name}
        filters={filters}
        setFilterParam={setFilterParam}
      />

      {products.length === 0 ? (
        <NoProducts />
      ) : (
        <>
          <ProductBreadCrumbs />
          <ProductGrid products={currentProducts} />
          {totalPages > 1 && (
            <PaginationUI
              currentPage={currentPage}
              totalPages={totalPages}
              makePageHref={makePageHref}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CategoryProducts;
