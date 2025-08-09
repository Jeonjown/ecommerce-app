import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreateAddressForm } from "../forms/CreateAddressForm";

interface CreateAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAddressModal({
  open,
  onOpenChange,
}: CreateAddressModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Provide the new address details. This will be saved to your account.
          </DialogDescription>
        </DialogHeader>

        <CreateAddressForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
