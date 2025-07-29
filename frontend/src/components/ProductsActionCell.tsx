// components/products/ActionCell.tsx
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DeleteProductModal from "@/components/modals/DeleteProductModal";
import UpdateProductModal from "@/components/modals/UpdateProductModal";
import type { ProductWithCategory } from "@/types/api/products";
import type { UpdateProductFormValues } from "@/components/forms/UpdateProductForm";

export function ProductActionCell({
  product,
}: {
  product: ProductWithCategory;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialData: UpdateProductFormValues = {
    name: product.name,
    description: product.description,
    category_id: product.category.id,
    is_active: product.is_active,
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleting(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateProductModal
        productId={product.id}
        initialData={initialData}
        open={isEditing}
        onOpenChange={setIsEditing}
      />

      <DeleteProductModal
        productId={product.id}
        open={isDeleting}
        onOpenChange={setIsDeleting}
      />
    </>
  );
}
