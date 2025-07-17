import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

import { VariantModal } from "@/components/VariantModal";
import type { Product, Variant } from "@/types/api/products";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <DataTableColumnHeader column={column} title="ID" />
        </div>
      );
    },
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
    accessorKey: "description",
    header: "Description",
  },

  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ getValue }) => ((getValue() as number) ? "Yes" : "No"),
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ getValue }) => {
      const variants = getValue() as Variant[];
      return <VariantModal variants={variants} />;
    },
  },
];
