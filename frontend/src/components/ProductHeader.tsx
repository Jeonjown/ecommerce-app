import Filters from "./Filters";

interface ProductHeader {
  categoryName?: string;
  filters: { sort?: string; priceRange?: string };
  setFilterParam: (key: string, value: string) => void;
}

const ProductHeader = ({
  categoryName,
  filters,
  setFilterParam,
}: ProductHeader) => {
  return (
    <div className="mt-4 mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-semibold">
        {categoryName ?? "All Products"}
      </h2>
      <Filters
        sortOrder={filters.sort ?? ""}
        priceRange={filters.priceRange ?? ""}
        onSortChange={(v) => setFilterParam("sort", v)}
        onPriceRangeChange={(v) => setFilterParam("priceRange", v)}
      />
    </div>
  );
};

export default ProductHeader;
