import ProductPage from "@/components/tables/products/ProductPage";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";

const Products = () => {
  return (
    <div className="mx-5 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products List</h1>
        <Button>
          <FaPlus className="text-white" size={20} />
          Add Products
        </Button>
      </div>

      <ProductPage />
    </div>
  );
};

export default Products;
