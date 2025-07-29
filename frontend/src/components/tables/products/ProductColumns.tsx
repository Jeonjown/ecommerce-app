import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { ProductWithCategory } from "@/types/api/products";
import type { ColumnDef } from "@tanstack/react-table";
import { VariantModal } from "@/components/modals/VariantModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DeleteProductModal from "@/components/modals/DeleteProductModal";

export const columns: ColumnDef<ProductWithCategory>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DataTableColumnHeader column={column} title="ID" />
      </div>
    ),
    cell: ({ getValue }) => {
      const id = getValue() as number;
      return <div className="ml-3">{id}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <DataTableColumnHeader column={column} title="Product Name" />
      </div>
    ),
  },
  {
    id: "category",
    accessorFn: (row) => row.category?.name ?? "N/A",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <DataTableColumnHeader column={column} title="Category" />
      </div>
    ),
    cell: ({ row }) => <span>{row.original.category?.name ?? "N/A"}</span>,
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => {
      const description = getValue() as string;
      return (
        <div className="text-muted-foreground line-clamp-2 max-w-[300px] truncate">
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ getValue }) => ((getValue() as boolean) ? "Yes" : "No"),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ getValue }) => {
      const slug = getValue() as string;
      return <code className="text-muted-foreground text-sm">{slug}</code>;
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      return (
        <div className="flex justify-start">
          <VariantModal
            productOptions={row.original.options}
            product={row.original}
          />
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Edit", product.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteProductModal productId={product.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
