import Loading from "@/pages/Loading";
import { useGetUsers } from "@/hooks/useGetUsers";
import { columns } from "./UserColumns";
import { UserTable } from "./UserTable";

const UsersPage = () => {
  const { data, isPending, isError } = useGetUsers();

  if (isError) {
    return <div className="text-red-600">Failed to load users.</div>;
  }

  return (
    <div className="container mx-auto">
      {isPending ? (
        <Loading />
      ) : (
        <UserTable columns={columns} data={data ?? []} />
      )}
    </div>
  );
};

export default UsersPage;
