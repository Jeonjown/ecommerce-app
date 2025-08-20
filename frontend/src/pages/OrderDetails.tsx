import { useParams } from "react-router-dom";
import { useGetOrderById } from "@/hooks/useGetOrderById";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderStatusProgress from "@/components/OrderStatusProgress";
import { Button } from "@/components/ui/button";

// Status color mapping
const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-500", text: "text-black" },
  paid: { bg: "bg-green-500", text: "text-white" },
  shipped: { bg: "bg-blue-500", text: "text-white" },
  delivered: { bg: "bg-green-600", text: "text-white" },
  cancelled: { bg: "bg-red-500", text: "text-white" },
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isPending, error } = useGetOrderById(orderId);

  if (isPending) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!order) return <p>No order found.</p>;

  // Determine button type
  const canCancelCOD =
    order.payment_method === "cod" &&
    ["pending", "processing"].includes(order.order_status);
  const canRequestRefundOnline =
    order.payment_method === "online" &&
    order.payment_status === "paid" &&
    ["pending", "processing", "shipped", "delivered"].includes(
      order.order_status,
    );

  const handleCancel = () => alert(`Order #${order.order_id} cancelled`);
  const handleRefund = () =>
    alert(`Refund requested for Order #${order.order_id}`);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="mt-6 text-xl font-semibold">Order Details</h2>

      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Order #{order.order_id}</span>
            <Badge
              className={`${statusStyles[order.order_status]?.bg || "bg-gray-200"} ${
                statusStyles[order.order_status]?.text || "text-black"
              }`}
            >
              {order.order_status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusProgress status={order.order_status} />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Customer:</span>{" "}
                {order.customer_name} ({order.customer_email})
              </p>
              <p>
                <span className="font-semibold">Placed on:</span>{" "}
                {new Date(order.order_date).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Payment:</span>{" "}
                {order.payment_method} —{" "}
                <Badge
                  className={`${statusStyles[order.payment_status]?.bg || "bg-gray-100"} ${
                    statusStyles[order.payment_status]?.text || "text-black"
                  }`}
                >
                  {order.payment_status}
                </Badge>
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Delivery Address:</span>{" "}
                {order.delivery_address}
              </p>
              <p className="text-primary text-lg font-bold">
                Total: ₱{(order.total_price / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            {canCancelCOD && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                className="ml-auto flex"
              >
                Cancel Order
              </Button>
            )}
            {canRequestRefundOnline && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRefund}
                className="ml-auto flex"
              >
                Request Refund
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.order_item_id}
              className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm transition hover:shadow-md md:flex-row md:items-center"
            >
              <div className="flex-shrink-0">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.variant_name || item.product_name}
                    className="h-20 w-20 rounded-md border object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-md border bg-gray-100 text-gray-400">
                    📦
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="font-semibold text-gray-900">
                  {item.product_name}
                </p>
                {item.variant_name && (
                  <Badge
                    variant="secondary"
                    className="w-fit rounded-full px-2 py-0.5 text-xs"
                  >
                    {item.variant_name}
                  </Badge>
                )}
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-sm text-gray-500">
                  Unit: ₱{(item.unit_price / 100).toFixed(2)}
                </p>
                <p className="font-semibold text-gray-900">
                  ₱{((item.unit_price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
