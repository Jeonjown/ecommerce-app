import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Variant } from "@/types/api/products";

interface VariantModalProps {
  variants: Variant[];
}

export function VariantModal({ variants }: VariantModalProps) {
  if (!variants.length) return "No variants";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View ({variants.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Product Variants</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="text-muted-foreground border-b pb-2 text-sm"
            >
              <div className="font-medium">SKU: {variant.sku}</div>
              <div>
                Options:{" "}
                {[variant.option1, variant.option2, variant.option3]
                  .filter(Boolean)
                  .join(" / ")}
              </div>
              <div>Price: ₱{parseFloat(variant.price).toLocaleString()}</div>
              <div>Stock: {variant.stock}</div>
              <div>Active: {variant.is_active ? "Yes" : "No"}</div>
            </div>
          ))}
        </div>
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
