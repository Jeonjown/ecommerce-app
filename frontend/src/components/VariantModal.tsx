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
              className="text-muted-foreground border-b pb-4 text-sm"
            >
              {/* Image */}
              {variant.image_url ? (
                <img
                  src={variant.image_url}
                  alt="Variant"
                  className="mb-2 h-32 w-full rounded object-cover"
                />
              ) : (
                <div className="mb-2 flex h-32 w-full items-center justify-center rounded bg-gray-100 text-xs">
                  No image
                </div>
              )}

              {/* Variant details */}
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
