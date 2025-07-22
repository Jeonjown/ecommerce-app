import CreateProductModal from "@/components/modals/CreateProductModal";
import ProductPage from "@/components/tables/products/ProductPage";

const Products = () => {
  return (
    <div className="mx-5 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products List</h1>
        <CreateProductModal />
      </div>

      <ProductPage />
    </div>
  );
};

export default Products;
