// components/tables/orders/OrderColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { OrderResponse } from "@/types/api/orders";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { OrderActionCell } from "@/components/OrderActionCell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { equalsFilterFn } from "@/utils/tableFilters";

const statusStyles: Record<string, { bg: string; text: string }> = {
  unpaid: { bg: "bg-yellow-500", text: "text-black" },
  paid: { bg: "bg-green-500", text: "text-white" },
  refunded: { bg: "bg-gray-500", text: "text-white" },

  pending: { bg: "bg-yellow-500", text: "text-black" },
  shipped: { bg: "bg-blue-500", text: "text-white" },
  delivered: { bg: "bg-green-600", text: "text-white" },
  cancelled: { bg: "bg-red-500", text: "text-white" },

  requested: { bg: "bg-yellow-500", text: "text-black" },
  approved: { bg: "bg-green-500", text: "text-white" },
  rejected: { bg: "bg-red-500", text: "text-white" },

  none: { bg: "bg-gray-200", text: "text-black" },
};

export const orderColumns: ColumnDef<OrderResponse>[] = [
  {
    accessorKey: "order_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Id" />
    ),
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ getValue }) => <span>User #{getValue() as number}</span>,
  },
  // Payment method (filterable)
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    filterFn: equalsFilterFn,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },

  // Payment status (dropdown cell; options depend on payment_method)
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    filterFn: equalsFilterFn,
    cell: ({ row }) => {
      const status = row.original.payment_status as string;
      const method = row.original.payment_method as string;

      const handleChange = (newStatus: string) => {
        // TODO: replace with mutation hook
        console.log("Update payment_status:", row.original.order_id, newStatus);
      };

      // Filter choices based on payment_method
      const paymentOptions =
        method === "online"
          ? ["pending", "paid", "failed", "refunded"] // no "unpaid"
          : ["unpaid", "pending", "paid", "failed", "refunded"];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`${statusStyles[status]?.bg || "bg-gray-200"} ${
                statusStyles[status]?.text || "text-black"
              }`}
            >
              {status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {paymentOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleChange(option)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },

  // Order status
  {
    accessorKey: "order_status",
    header: "Order Status",
    filterFn: equalsFilterFn,
    cell: ({ row }) => {
      const status = row.original.order_status as string;

      const handleChange = (newStatus: string) => {
        // TODO: replace with mutation hook
        console.log("Update order_status:", row.original.order_id, newStatus);
      };

      const orderOptions = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`${statusStyles[status]?.bg || "bg-gray-200"} ${
                statusStyles[status]?.text || "text-black"
              }`}
            >
              {status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {orderOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleChange(option)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },

  // Refund status
  {
    accessorKey: "refund_status",
    header: "Refund Status",
    filterFn: equalsFilterFn,
    cell: ({ row }) => {
      const status = row.original.refund_status || "none";

      const handleChange = (newStatus: string) => {
        // TODO: replace with mutation hook
        console.log("Update refund_status:", row.original.order_id, newStatus);
      };

      const refundOptions = [
        "none",
        "requested",
        "processing",
        "completed",
        "rejected",
      ];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`${statusStyles[status]?.bg || "bg-gray-200"} ${
                statusStyles[status]?.text || "text-black"
              }`}
            >
              {status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {refundOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleChange(option)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },

  {
    accessorKey: "order_total",
    header: "Total",
    cell: ({ getValue }) => `₱${((getValue() as number) / 100).toFixed(2)}`,
  },

  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OrderActionCell order={row.original} />,
  },
];
