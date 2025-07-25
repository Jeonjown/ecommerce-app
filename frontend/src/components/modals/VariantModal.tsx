import type { ProductOption, ProductWithCategory } from "@/types/api/products";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import OptionsList from "../OptionsList";
import { useGetVariantsbyProductId } from "@/hooks/useGetVariantsbyProductId";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { FaEdit } from "react-icons/fa";
import DeleteVariantModal from "../DeleteVariantModal";
import VariantOptionsList from "../VariantOptionsList";
import { useState } from "react";
import VariantForm from "../forms/VariantForm";

interface VariantModalProps {
  productName: string;
  productOptions: ProductOption[];
  product: ProductWithCategory;
}

export function VariantModal({ product }: VariantModalProps) {
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const { data = [] } = useGetVariantsbyProductId(product.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setIsAddingVariant(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{product.name} Variants</DialogTitle>
          <DialogDescription>
            A list of all available variants and their details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[75vh] flex-col space-y-6 overflow-y-auto pr-2">
          {!isAddingVariant && <OptionsList id={product.id} />}

          {/* Toggle Add Variant */}
          <Button
            className="ml-auto"
            onClick={() => setIsAddingVariant((prev) => !prev)}
          >
            {isAddingVariant ? "Cancel" : "Add Variant"}
          </Button>

          {isAddingVariant ? (
            <VariantForm
              product_id={product.id}
              onSuccess={() => setIsAddingVariant(false)}
            />
          ) : data.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No variants found.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {data.map((variant) => (
                <Card
                  key={variant.id}
                  className="rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md"
                >
                  <CardHeader className="pb-0">
                    <div className="h-40 w-full overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={variant.image_url}
                        alt="variant image"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="pt-2">
                    <h3 className="text-sm font-semibold">{variant.sku}</h3>
                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        ₱{Number(variant.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Stock: {variant.stock}
                      </p>
                    </div>

                    <VariantOptionsList variantId={variant.id} />
                  </CardContent>

                  <CardFooter className="mt-auto flex items-center justify-between pt-0">
                    <Badge
                      variant={variant.is_active ? "default" : "destructive"}
                      className="px-2 py-1 text-xs"
                    >
                      {variant.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <div className="space-x-1">
                      <Button size="icon" variant="outline">
                        <FaEdit />
                      </Button>
                      <DeleteVariantModal
                        productId={product.id}
                        variantId={variant.id}
                      />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
