import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRequestCancelOrder } from "@/hooks/useRequestCancelOrder";
import ReasonSelector from "./ReasonSelector";

interface RefundDialogProps {
  setOpen: (open: boolean) => void;
  orderId: number;
  actionLabel: string;
}

const RefundDialog = ({ setOpen, orderId, actionLabel }: RefundDialogProps) => {
  const { mutate: requestCancel, isPending } = useRequestCancelOrder();
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return;

    requestCancel(
      {
        orderId,
        payload: { reason },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setReason("");
        },
      },
    );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{actionLabel}</DialogTitle>
      </DialogHeader>

      <ReasonSelector setReason={setReason} />

      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending || !reason.trim()}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default RefundDialog;
