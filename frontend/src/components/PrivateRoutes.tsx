import { Outlet, Navigate } from "react-router-dom";
import { useGetLoggedInUser } from "../hooks/useGetLoggedInUser";
import Loading from "../pages/Loading";

const PrivateRoutes = () => {
  const { data, isPending } = useGetLoggedInUser();

  if (isPending) {
    return <Loading />;
  }

  if (!data || (data.user.role !== "user" && data.user.role !== "admin")) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
