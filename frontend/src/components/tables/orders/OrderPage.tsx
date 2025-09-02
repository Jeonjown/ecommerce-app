// pages/admin/OrdersPage.tsx
import Loading from "@/pages/Loading";
import { useGetAllOrders } from "@/hooks/useGetAllOrders";
import { OrdersTable } from "./OrderTable";
import { orderColumns } from "./OrderColumns";

const OrdersPage = () => {
  const { data, isPending, error } = useGetAllOrders();

  if (isPending) return <Loading />;
  if (error) return <div className="text-red-600">{error.message}</div>;
  return (
    <div className="container mx-auto">
      <OrdersTable columns={orderColumns} data={data ?? []} />
    </div>
  );
};

export default OrdersPage;
