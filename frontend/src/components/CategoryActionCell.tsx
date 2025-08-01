import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/api/categories";
import UpdateCategoryModal from "./modals/UpdateCategoryModal";
import DeleteCategoryModal from "./modals/DeleteCategoryModal";

export function CategoryActionCell({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleting(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateCategoryModal
        category={category}
        open={isEditing}
        onOpenChange={setIsEditing}
      />

      <DeleteCategoryModal
        categoryId={category.id}
        open={isDeleting}
        onOpenChange={setIsDeleting}
      />
    </>
  );
}
