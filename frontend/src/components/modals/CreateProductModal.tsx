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
import ProductForm from "../forms/ProductForm";
import { OptionForm } from "../forms/OptionForm";

const CreateProductModal = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <FaPlus className="text-white" size={20} />
            Add Products
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
            <DialogDescription>Fill in to Create a Product.</DialogDescription>

            <ProductForm />
            <OptionForm />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateProductModal;
