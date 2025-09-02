import UserPage from "@/components/tables/users/UserPage";

const AdminUsers = () => {
  return (
    <div className="mx-5 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User List</h1>
      </div>

      <UserPage />
    </div>
  );
};

export default AdminUsers;
