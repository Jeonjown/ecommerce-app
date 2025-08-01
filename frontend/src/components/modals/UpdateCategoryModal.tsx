import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Category } from "@/types/api/categories";
import UpdateCategoryForm from "../forms/UpdateCategoryForm";

interface Props {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateCategoryModal({
  category,
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <UpdateCategoryForm
          categoryId={category.id}
          initialData={{ name: category.name }}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
