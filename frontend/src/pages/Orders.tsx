// components/Orders.tsx
import { useState } from "react";
import { useGetOrdersByUserId } from "@/hooks/useGetOrdersByUserId";
import { OrderCard } from "@/components/OrderCard";
import { StatusTabs } from "@/components/StatusTabs";
import type { Order } from "@/types/api/orders";

const STATUS_TABS = [
  "pending",
  "processing",
  "delivered",
  "cancelled",
  "refunds",
] as const;

const Orders = () => {
  const { data } = useGetOrdersByUserId();
  const [activeTab, setActiveTab] =
    useState<(typeof STATUS_TABS)[number]>("pending");

  // Group items by order_id
  const groupedOrders: Order[] = data
    ? Object.values(
        data.reduce<Record<number, Order>>((acc, item) => {
          if (!acc[item.order_id]) {
            acc[item.order_id] = {
              order_id: item.order_id,
              user_id: item.user_id,
              payment_method: item.payment_method,
              payment_status: item.payment_status,
              order_status: item.order_status,
              refund_status: item.refund_status,
              order_total: item.order_total,
              delivery_address: item.delivery_address,
              created_at: item.created_at, // add created_at
              items: [],
            };
          }
          acc[item.order_id].items.push(item);
          return acc;
        }, {}),
      )
        // sort grouped orders by created_at descending
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
    : [];

  // Filter grouped orders by tab
  const filteredOrders = groupedOrders.filter((order) =>
    activeTab === "refunds"
      ? order.refund_status && order.refund_status !== "none"
      : order.order_status === activeTab,
  );

  return (
    <div className="bg- flex w-full flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-2xl">
        <StatusTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={STATUS_TABS}
        >
          {filteredOrders.length ? (
            <div className="flex w-full flex-col gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.order_id} order={order} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-500">
              No orders in this category.
            </p>
          )}
        </StatusTabs>
      </div>
    </div>
  );
};

export default Orders;
