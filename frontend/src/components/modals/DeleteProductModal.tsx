import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";

interface DeleteProductModalProps {
  productId: number;
}

const DeleteProductModal = ({ productId }: DeleteProductModalProps) => {
  const [open, setOpen] = useState(false);
  const { mutate } = useDeleteProduct();

  const handleDelete = (productId: number) => {
    mutate(productId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="w-full text-left"
        >
          Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            product.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={() => handleDelete(productId)}>
            Yes, delete it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductModal;
