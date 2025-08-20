import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { OrderResponse } from "@/types/api/orders";
// import ViewOrderModal from "./modals/ViewOrderModal";
// import UpdateOrderModal from "./modals/UpdateOrderModal";
// import CancelOrderModal from "./modals/CancelOrderModal";
// import RefundOrderModal from "./modals/RefundOrderModal";

interface OrderActionCellProps {
  order: OrderResponse;
}

export function OrderActionCell({ order }: OrderActionCellProps) {
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

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
          <DropdownMenuItem onClick={() => setIsViewing(true)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            Edit
          </DropdownMenuItem>
          {canCancelCOD && (
            <DropdownMenuItem onClick={() => setIsCancelling(true)}>
              Cancel Order
            </DropdownMenuItem>
          )}
          {canRefundOnline && (
            <DropdownMenuItem onClick={() => setIsRefunding(true)}>
              Request Refund
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <ViewOrderModal
        order={order}
        open={isViewing}
        onOpenChange={setIsViewing}
      />

      <UpdateOrderModal
        order={order}
        open={isEditing}
        onOpenChange={setIsEditing}
      />

      <CancelOrderModal
        orderId={order.order_id}
        open={isCancelling}
        onOpenChange={setIsCancelling}
      />

      <RefundOrderModal
        orderId={order.order_id}
        open={isRefunding}
        onOpenChange={setIsRefunding}
      /> */}
    </>
  );
}
