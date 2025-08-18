import NoProducts from "@/components/NoProducts";
import PaginationUI from "@/components/PaginationUi";
import ProductBreadCrumbs from "@/components/ProductBreadCrumbs";
import ProductGrid from "@/components/ProductGrid";
import ProductHeader from "@/components/ProductHeader";
import { Skeleton } from "@/components/ui/skeleton"; // 👈 shadcn skeleton
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
        {/* Header row */}
        <div className="flex items-center justify-between">
          {/* Category Title (e.g. Laptops) */}
          <Skeleton className="h-8 w-40" />

          {/* Filters on the right */}
          <div className="flex gap-4">
            <Skeleton className="h-6 w-24" /> {/* Sort by */}
            <Skeleton className="h-6 w-32" /> {/* Price Range */}
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" /> {/* Home */}
          <Skeleton className="h-4 w-16" /> {/* Categories */}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col space-y-3 rounded-xl border p-4 shadow-sm"
            >
              {/* Product image */}
              <Skeleton className="h-48 w-full rounded-lg" />

              {/* Product name */}
              <Skeleton className="h-5 w-3/4" />

              {/* Price */}
              <Skeleton className="h-4 w-1/2" />

              {/* Optional brand/category line */}
              <Skeleton className="h-3 w-1/3" />
            </div>
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
