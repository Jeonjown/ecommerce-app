// src/pages/admin/AdminOrdersDetails.tsx
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useGetOrderByIdForAdmin } from "@/hooks/useGetOrderByIdForAdmin";
import OrderStatusCell from "@/components/tables/orders/OrderStatusCell";
import type { OrderItemResponse } from "@/types/api/orders";

const formatMoney = (cents?: number) =>
  cents == null ? "—" : `₱${(cents / 100).toFixed(2)}`;

const AdminOrdersDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = id ? Number(id) : undefined;

  const { data: order, isLoading, error } = useGetOrderByIdForAdmin(orderId);

  console.log(order);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent>Loading order…</CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Order not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Could not load order {id}. {error ? "There was an error." : ""}
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canCancelCOD =
    order.payment_method === "cod" &&
    ["pending", "processing"].includes(order.order_status ?? "");

  const canRefundOnline =
    order.payment_method === "online" &&
    order.payment_status === "paid" &&
    ["pending", "processing", "shipped", "delivered"].includes(
      order.order_status ?? "",
    );

  const handleEdit = () => navigate(`/admin/orders/${order.order_id}/edit`);

  const handleCancel = () => {
    if (!window.confirm("Cancel this order? This action may be irreversible."))
      return;
    console.info("Cancel order:", order.order_id);
    window.alert("Cancel order action triggered (implement mutation).");
  };

  const handleRequestRefund = () => {
    if (
      !window.confirm(
        "Request refund for this order? This will start the refund flow.",
      )
    )
      return;
    console.info("Request refund for order:", order.order_id);
    window.alert("Refund request triggered (implement mutation).");
  };

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header / Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Order #{order.order_id}</h1>
          <Badge>{order.order_status ?? "none"}</Badge>
        </div>

        <div className="flex gap-2">
          <Link to="/admin/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
          <Button onClick={handleEdit}>Edit</Button>
          {canCancelCOD && (
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Order
            </Button>
          )}
          {canRefundOnline && (
            <Button onClick={handleRequestRefund}>Request Refund</Button>
          )}
        </div>
      </div>

      {/* Summary & Shipping */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-muted-foreground text-sm">Customer</div>
              <div>User #{order.user_id ?? "—"}</div>
            </div>

            <div>
              <div className="text-muted-foreground text-sm">Payment</div>
              <div className="flex items-center gap-3">
                <span>{order.payment_method ?? "—"}</span>
                <OrderStatusCell
                  orderId={order.order_id}
                  value={order.payment_status ?? "none"}
                  field="payment_status"
                  options={
                    order.payment_method === "online"
                      ? ["pending", "paid", "failed", "refunded"]
                      : ["unpaid", "pending", "paid", "failed", "refunded"]
                  }
                />
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-sm">Order Status</div>
              <OrderStatusCell
                orderId={order.order_id}
                value={order.order_status ?? "none"}
                field="order_status"
                options={[
                  "pending",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ]}
              />
            </div>

            <div>
              <div className="text-muted-foreground text-sm">Refund Status</div>
              <OrderStatusCell
                orderId={order.order_id}
                value={order.refund_status ?? "none"}
                field="refund_status"
                options={[
                  "none",
                  "requested",
                  "processing",
                  "completed",
                  "rejected",
                ]}
              />
            </div>

            <div>
              <div className="text-muted-foreground text-sm">Total</div>
              <div className="text-lg font-medium">
                {formatMoney(order.total_price)}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground text-sm">Created At</div>
              <div>
                {order.order_date
                  ? new Date(order.order_date).toLocaleString()
                  : "—"}
              </div>
            </div>

            {order.cancellation_reason && (
              <div>
                <div className="text-muted-foreground text-sm">
                  Cancel / Refund Reason
                </div>
                <div>{order.cancellation_reason}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Shipping & Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-muted-foreground text-sm">
                Delivery Address
              </div>
              <div>{order.delivery_address ?? "—"}</div>
            </div>

            <div>
              <div className="text-muted-foreground mb-2 text-sm">Items</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead> {/* New column */}
                    <TableHead>Product</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>No items</TableCell>
                    </TableRow>
                  )}

                  {items.map((it: OrderItemResponse) => {
                    const productName = it.product_name ?? "Item";
                    const variantName = it.variant_name ?? "-";
                    const qty =
                      typeof it.quantity === "number" ? it.quantity : 1;
                    const unitPrice =
                      typeof it.unit_price === "number" ? it.unit_price : 0;
                    const subtotal = unitPrice * qty;

                    return (
                      <TableRow
                        key={
                          it.order_item_id ?? `${productName}-${Math.random()}`
                        }
                      >
                        <TableCell>
                          {it.image_url ? (
                            <img
                              src={it.image_url}
                              alt={variantName}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>{productName}</TableCell>
                        <TableCell className="max-w-sm truncate">
                          {variantName}
                        </TableCell>
                        <TableCell>{qty}</TableCell>
                        <TableCell>{formatMoney(unitPrice)}</TableCell>
                        <TableCell>{formatMoney(subtotal)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrdersDetails;
