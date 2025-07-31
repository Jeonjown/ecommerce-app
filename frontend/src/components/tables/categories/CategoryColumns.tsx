import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/types/api/categories";

export const columns: ColumnDef<Category>[] = [
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
        <DataTableColumnHeader column={column} title="Category Name" />
      </div>
    ),
    filterFn: (row, id, filterValue) => {
      return (filterValue as string[]).includes(row.getValue(id));
    },
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
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
];
