import { ProductCard } from "./ProductCard";
import type { ProductWithCategory } from "@/types/api/products";

interface ProductGridProps {
  products: ProductWithCategory[];
}

const ProductGrid = ({ products }: ProductGridProps) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {products.map((p) => (
      <ProductCard key={p.id} product={p} />
    ))}
  </div>
);

export default ProductGrid;
