import type {
  ProductOption,
  ProductWithCategory,
  Variant,
} from "@/types/api/products";
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
import { Badge } from "./ui/badge";
import { ImageIcon } from "lucide-react";

interface VariantModalProps {
  variants: Variant[];
  productName: string;
  productOptions: ProductOption[];
  product: ProductWithCategory;
}

export function VariantModal({ variants, product }: VariantModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.name} Variants</DialogTitle>
          <DialogDescription>
            A list of all available variants and their details.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-2">
          {/* Variants Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="rounded-lg border p-4 shadow-sm transition hover:shadow"
              >
                {variant.image_url ? (
                  <img
                    src={variant.image_url}
                    alt="Variant"
                    className="mb-3 h-40 w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="mb-3 flex h-40 w-full items-center justify-center rounded-md bg-gray-100 text-gray-400">
                    <ImageIcon className="h-6 w-6" />
                    <span className="ml-2 text-xs">No Image</span>
                  </div>
                )}

                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">SKU:</span> {variant.sku}
                  </div>
                  <div>
                    <span className="font-medium">Options:</span>{" "}
                    {variant.options
                      .map((opt) => `${opt.option_name}: ${opt.option_value}`)
                      .join(" / ")}
                  </div>
                  <div>
                    <span className="font-medium">Price:</span> ₱
                    {parseFloat(variant.price).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span> {variant.stock}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {variant.is_active ? (
                      <Badge variant={"default"} className="ml-1">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="ml-1">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
