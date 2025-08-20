// pages/admin/AdminOrders.tsx

import OrdersPage from "@/components/tables/orders/OrderPage";
import { useGetAllOrders } from "@/hooks/useGetAllOrders";

const AdminOrders = () => {
  const { data } = useGetAllOrders();
  console.log(data); // for debugging

  return (
    <div className="mx-5 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Orders</h1>
        {/* Optional modal button */}
        {/* <CreateOrderModal /> */}
      </div>

      <OrdersPage />
    </div>
  );
};

export default AdminOrders;
