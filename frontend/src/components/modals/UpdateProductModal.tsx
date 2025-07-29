// src/components/modals/UpdateProductModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UpdateProductForm, {
  type UpdateProductFormValues,
} from "../forms/UpdateProductForm";

interface Props {
  productId: number;
  initialData: UpdateProductFormValues;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateProductModal({
  productId,
  initialData,
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <UpdateProductForm
          productId={productId}
          initialData={initialData}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
