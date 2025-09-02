import CreateCategoryModal from "@/components/modals/CreateCategoryModal";
import CategoryPage from "@/components/tables/categories/CategoryPage";

const AdminCategories = () => {
  return (
    <div className="mx-5 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Category List</h1>
        <CreateCategoryModal />
      </div>

      <CategoryPage />
    </div>
  );
};

export default AdminCategories;
