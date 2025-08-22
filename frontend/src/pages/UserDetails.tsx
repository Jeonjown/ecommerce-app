import { useParams } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaUserShield,
  FaCalendarAlt,
} from "react-icons/fa";
import { useGetUserById } from "@/api/useGetUserById";
import { useGetOrdersByUserId } from "@/hooks/useGetOrdersByUserId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order, OrderItem } from "@/types/api/orders";

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    error: userErrorObj,
  } = useGetUserById(userId);

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersErrorObj,
  } = useGetOrdersByUserId(userId);

  if (userLoading) return <div>Loading user details...</div>;
  if (userError) return <div>Error: {(userErrorObj as Error).message}</div>;
  if (!userData?.user) return <div>No user found.</div>;

  const { user } = userData;

  const groupedOrders: Order[] = ordersData
    ? Object.values(
        ordersData.reduce<Record<number, Order>>((acc, item: OrderItem) => {
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
              created_at: item.created_at,
              items: [],
            };
          }
          acc[item.order_id].items.push(item);
          return acc;
        }, {}),
      ).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    : [];

  return (
    <div className="space-y-6 p-4">
      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <FaIdBadge className="text-gray-500" />
              <span>
                <strong>ID:</strong> {user.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-500" />
              <span>
                <strong>Name:</strong> {user.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <span>
                <strong>Email:</strong> {user.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaUserShield className="text-gray-500" />
              <span>
                <strong>Role:</strong> {user.role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <span>
                <strong>Created At:</strong>{" "}
                {new Date(user.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div>Loading orders...</div>
          ) : ordersError ? (
            <div>Error: {(ordersErrorObj as Error).message}</div>
          ) : groupedOrders.length === 0 ? (
            <div>No orders found for this user.</div>
          ) : (
            <div className="max-h-[500px] overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedOrders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell>{order.order_id}</TableCell>
                      <TableCell>{order.order_status}</TableCell>
                      <TableCell>
                        {order.payment_status} ({order.payment_method})
                      </TableCell>
                      <TableCell>
                        ${(order.order_total / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>{order.delivery_address}</TableCell>
                      <TableCell className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.order_item_id}
                            className="flex items-center gap-2"
                          >
                            <img
                              src={item.variant_image}
                              alt={item.product_name}
                              className="h-12 w-12 rounded object-cover"
                            />
                            <div>
                              <p className="font-semibold">
                                {item.product_name}
                              </p>
                              <p>
                                {item.variant_name} — Qty: {item.quantity}
                              </p>
                              <p>
                                ${(item.variant_price / 100).toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
