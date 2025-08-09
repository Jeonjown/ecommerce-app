import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Address } from "@/types/api/address";
import { EditAddressForm } from "../forms/EditAddressForm";

interface EditAddressModalProps {
  address: { id: number } & Address;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditAddressModal: React.FC<EditAddressModalProps> = ({
  address,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please update your address details below.
        </DialogDescription>
        <EditAddressForm
          addressId={address.id}
          initialData={address}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
