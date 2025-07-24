import { FaTrashAlt } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useDeleteVariantById } from "@/hooks/useDeleteVariantById";

interface DeleteVariantModalProps {
  productId: number;
  variantId: number;
}

const DeleteVariantModal = ({
  productId,
  variantId,
}: DeleteVariantModalProps) => {
  const { mutate: deleteVariant } = useDeleteVariantById(productId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <FaTrashAlt />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            variant and remove its data.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => deleteVariant(variantId)}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteVariantModal;
