import { Navigate, Outlet } from "react-router-dom";
import { useGetLoggedInUser } from "../hooks/useGetLoggedInUser";
import Loading from "../pages/Loading";

const AdminRoutes = () => {
  const { data, isPending, isError } = useGetLoggedInUser();

  if (isPending) return <Loading />;

  if (isError || !data || data.user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;
