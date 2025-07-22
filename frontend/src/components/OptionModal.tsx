import type { ProductWithCategory } from "@/types/api/products";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import OptionsList from "./OptionsList";

interface VariantModalProps {
  product: ProductWithCategory;
}

export function OptionModal({ product }: VariantModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.name} </DialogTitle>
          <DialogDescription>
            A list of all available Options and their details.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[75vh] space-y-6 overflow-y-auto">
          {/* Product Options Overview */}
          <OptionsList id={product.id} />
        </div>

        <DialogClose asChild>
          <Button variant="secondary" className="mt-4">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
