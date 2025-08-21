import type { ColumnDef } from "@tanstack/react-table";
import type { OrderResponse } from "@/types/api/orders";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { OrderActionCell } from "@/components/OrderActionCell";

import { equalsFilterFn } from "@/utils/tableFilters";

import OrderStatusCell from "./OrderStatusCell";

// ---- Columns
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

  {
    accessorKey: "payment_method",
    header: "Payment Method",
    filterFn: equalsFilterFn,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },

  {
    accessorKey: "payment_status",
    header: "Payment Status",
    filterFn: equalsFilterFn,
    cell: ({ row }) => {
      const method = row.original.payment_method;
      const status = row.original.payment_status ?? "none";
      const options =
        method === "online"
          ? ["pending", "paid", "failed", "refunded"]
          : ["unpaid", "pending", "paid", "failed", "refunded"];

      return (
        <OrderStatusCell
          orderId={row.original.order_id}
          value={status}
          field="payment_status"
          options={options}
        />
      );
    },
  },

  {
    accessorKey: "order_status",
    header: "Order Status",
    filterFn: equalsFilterFn,
    cell: ({ row }) => (
      <OrderStatusCell
        orderId={row.original.order_id}
        value={row.original.order_status ?? "none"}
        field="order_status"
        options={["pending", "processing", "shipped", "delivered", "cancelled"]}
      />
    ),
  },

  {
    accessorKey: "refund_status",
    header: "Refund Status",
    filterFn: equalsFilterFn,
    cell: ({ row }) => (
      <OrderStatusCell
        orderId={row.original.order_id}
        value={row.original.refund_status ?? "none"}
        field="refund_status"
        options={["none", "requested", "processing", "completed", "rejected"]}
      />
    ),
  },
  {
    accessorKey: "cancellation_reason",
    header: "Refund / Cancel Reason",
    cell: ({ getValue, row }) => {
      const reason = getValue() as string | null;
      return row.original.refund_status && row.original.refund_status !== "none"
        ? reason || "No reason provided"
        : "-";
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
