import { useState } from "react";
import { FaEdit } from "react-icons/fa";

import type { ProductOption, ProductWithCategory } from "@/types/api/products";
import { useGetVariantsbyProductId } from "@/hooks/useGetVariantsbyProductId";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";

import OptionsList from "../OptionsList";
import VariantForm from "../forms/VariantForm";
import UpdateVariantForm from "../forms/UpdateVariantForm";
import VariantOptionsList from "../VariantOptionsList";
import DeleteVariantModal from "../DeleteVariantModal";

interface VariantModalProps {
  product: ProductWithCategory;
  productOptions: ProductOption[];
}

export function VariantModal({ product }: VariantModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [variantToUpdate, setVariantToUpdate] = useState<number | null>(null);

  const { data: variants = [] } = useGetVariantsbyProductId(product.id);

  const handleCloseForm = () => {
    setIsAddingVariant(false);
    setVariantToUpdate(null);
  };

  const handleOpenUpdateForm = (id: number) => {
    setIsAddingVariant(false);
    setVariantToUpdate(id);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) handleCloseForm();
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
          {/* Options Summary */}
          {!isAddingVariant && variantToUpdate === null && (
            <OptionsList id={product.id} />
          )}

          {/* Toggle Add Variant */}
          {!variantToUpdate && (
            <Button
              className="ml-auto"
              onClick={() => setIsAddingVariant((prev) => !prev)}
            >
              {isAddingVariant ? "Cancel" : "Add Variant"}
            </Button>
          )}

          {/* Update Form */}
          {variantToUpdate !== null && (
            <UpdateVariantForm
              product_id={product.id}
              variant_id={variantToUpdate}
              onSuccess={handleCloseForm}
              onCancel={handleCloseForm}
            />
          )}

          {/* Add Form */}
          {isAddingVariant && (
            <VariantForm product_id={product.id} onSuccess={handleCloseForm} />
          )}

          {/* Variants List */}
          {!isAddingVariant && variantToUpdate === null && (
            <>
              {variants.length === 0 ? (
                <p className="text-muted-foreground text-center">
                  No variants found.
                </p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {variants.map((variant) => (
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

                      <CardContent className="space-y-2 pt-2">
                        {variant.name && (
                          <h3 className="text-base font-semibold">
                            {variant.name}
                          </h3>
                        )}
                        <h4 className="text-xs">{variant.sku}</h4>
                        {variant.description && (
                          <p className="text-muted-foreground line-clamp-2 text-sm">
                            {variant.description}
                          </p>
                        )}

                        <p className="text-xs text-gray-500">
                          ID: {variant.id}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-primary text-sm font-semibold">
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
                          variant={
                            variant.is_active ? "default" : "destructive"
                          }
                          className="px-2 py-1 text-xs"
                        >
                          {variant.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <div className="space-x-1">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleOpenUpdateForm(variant.id)}
                          >
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
