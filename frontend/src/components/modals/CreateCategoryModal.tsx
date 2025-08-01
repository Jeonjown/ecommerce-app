import { FaPlus } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Button } from "../ui/button";
import CategoryForm from "../forms/CategoryForm";

const CreateCategoryModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FaPlus className="mr-2 text-white" size={20} />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Fill in to create a new category.
          </DialogDescription>
          <CategoryForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
