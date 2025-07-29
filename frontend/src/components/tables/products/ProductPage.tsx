import { useGetProducts } from "@/hooks/useGetProducts";
import Loading from "@/pages/Loading";
import { columns } from "./ProductColumns";
import { ProductTable } from "./ProductTable";

const ProductPage = () => {
  const { data, isPending, isError } = useGetProducts();
  console.log(data);

  if (isError) {
    return <div className="text-red-600">Failed to load products.</div>;
  }

  return (
    <div className="container mx-auto">
      {isPending ? (
        <Loading />
      ) : (
        <ProductTable columns={columns} data={data.products ?? []} />
      )}
    </div>
  );
};

export default ProductPage;
