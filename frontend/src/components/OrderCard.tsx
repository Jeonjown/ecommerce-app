// components/OrderCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order, OrderItem } from "@/types/api/orders";
import { Link } from "react-router-dom";

interface OrderCardProps {
  order: Order & { items: OrderItem[] };
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const statusColorClass = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  } as const;

  return (
    <Link to={`/orders/${order.order_id}`}>
      <Card className="w-full rounded-xl border border-gray-200 shadow-lg">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex w-full items-start">
            <CardTitle className="text-lg font-bold">
              Order #{order.order_id}
            </CardTitle>
            {order.refund_status && order.refund_status !== "none" && (
              <Badge
                variant="destructive"
                className="ml-auto flex text-xs uppercase"
              >
                {`REFUND ${order.refund_status}`}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              className={`rounded px-2 py-1 text-xs font-semibold uppercase ${statusColorClass[order.order_status]}`}
            >
              {order.order_status}
            </Badge>
            <Badge variant="secondary" className="text-xs uppercase">
              {order.payment_method}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Total:</span>
            <span className="text-lg font-bold">
              ₱{(order.order_total / 100).toLocaleString()}
            </span>
          </div>

          <div className="truncate text-sm text-gray-600">
            <span className="font-semibold">Delivery:</span>{" "}
            {order.delivery_address}
          </div>

          <div className="mt-2 flex flex-col gap-3 border-t pt-2">
            {order.items.map((item) => (
              <div key={item.order_item_id} className="flex items-center gap-3">
                <img
                  src={item.variant_image}
                  alt={item.variant_name}
                  className="h-16 w-16 flex-shrink-0 rounded-lg border object-cover sm:h-12 sm:w-12"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate font-semibold text-gray-800">
                    {item.product_name}
                  </span>
                  <span className="truncate text-sm text-gray-500">
                    {item.variant_name} x {item.quantity}
                  </span>
                </div>
                <span className="ml-auto font-semibold text-gray-800">
                  ₱{(item.unit_price / 100).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
