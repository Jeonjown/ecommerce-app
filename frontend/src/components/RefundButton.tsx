import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { OrderResponse } from "@/types/api/orders";
import RefundDialog from "./RefundDialog";

interface RefundButtonProps {
  order: OrderResponse;
}

const RefundButton = ({ order }: RefundButtonProps) => {
  const [open, setOpen] = useState(false);

  // COD cancel rules
  const canCancelCOD =
    order.payment_method === "cod" &&
    ["pending", "processing"].includes(order.order_status);

  // Online refund rules
  const canRefundOnline =
    order.payment_method === "online" &&
    order.payment_status === "paid" &&
    ["pending", "processing", "shipped", "delivered"].includes(
      order.order_status,
    );

  // Check if a request already exists
  const hasRequest = !!order.refund_status && order.refund_status !== "none";

  // If nothing can be done, hide the button
  if (!canCancelCOD && !canRefundOnline && !hasRequest) return null;

  // Determine button label
  const label = canCancelCOD
    ? "Cancel Order"
    : canRefundOnline
      ? "Request Refund"
      : hasRequest
        ? "Request Pending"
        : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="ml-auto flex"
          disabled={hasRequest}
        >
          {label}
        </Button>
      </DialogTrigger>

      <RefundDialog
        setOpen={setOpen}
        orderId={order.order_id}
        actionLabel={label}
      />
    </Dialog>
  );
};

export default RefundButton;
