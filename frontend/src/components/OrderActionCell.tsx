import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { OrderResponse } from "@/types/api/orders";
import { Link } from "react-router-dom";

interface OrderActionCellProps {
  order: OrderResponse;
}

export function OrderActionCell({ order }: OrderActionCellProps) {
  const canCancelCOD =
    order.payment_method === "cod" &&
    ["pending", "processing"].includes(order.order_status);

  const canRefundOnline =
    order.payment_method === "online" &&
    order.payment_status === "paid" &&
    ["pending", "processing", "shipped", "delivered"].includes(
      order.order_status,
    );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/admin/orders/${order.order_id}`}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          {canCancelCOD && <DropdownMenuItem>Cancel Order</DropdownMenuItem>}
          {canRefundOnline && (
            <DropdownMenuItem>Request Refund</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
