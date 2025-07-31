import Loading from "@/pages/Loading";

import { useGetCategories } from "@/hooks/useGetCategories";
import { CategoryTable } from "./CategoryTable";
import { columns } from "./CategoryColumns";

const CategoryPage = () => {
  const { data, isPending, isError } = useGetCategories();

  if (isError) {
    return <div className="text-red-600">Failed to load products.</div>;
  }

  return (
    <div className="container mx-auto">
      {isPending ? (
        <Loading />
      ) : (
        <CategoryTable columns={columns} data={data.categories ?? []} />
      )}
    </div>
  );
};

export default CategoryPage;
