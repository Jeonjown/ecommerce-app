import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TiDeleteOutline } from "react-icons/ti";

import { useDeleteOptionByOptionId } from "@/hooks/useDeleteOptionByOptionId";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface DeleteOptionModalProps {
  optionId: number;
  productId: number;
  optionName: string;
}

const DeleteOptionModal = ({
  optionId,
  optionName,
  productId,
}: DeleteOptionModalProps) => {
  const { mutate: deleteOption } = useDeleteOptionByOptionId(productId);

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <TiDeleteOutline className="text-destructive !size-7 cursor-pointer hover:scale-105" />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">Delete Option</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you absolutely sure to delete option: {optionName}?{" "}
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            option.
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={() => deleteOption(optionId)}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Confirm Delete
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOptionModal;
