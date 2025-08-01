import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";

interface DeleteCategoryModalProps {
  categoryId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteCategoryModal({
  categoryId,
  open,
  onOpenChange,
}: DeleteCategoryModalProps) {
  const { mutate, isPending } = useDeleteCategory();

  const handleConfirm = () => {
    mutate(categoryId, {
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
