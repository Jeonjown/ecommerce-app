import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";

interface DeleteProductModalProps {
  productId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteProductModal({
  productId,
  open,
  onOpenChange,
}: DeleteProductModalProps) {
  const { mutate, isPending } = useDeleteProduct();

  const handleConfirm = () => {
    mutate(productId, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            Yes, delete it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
