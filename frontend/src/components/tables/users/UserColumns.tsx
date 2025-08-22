import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types/api/user";
import { UserActionCell } from "./UserActionCell";

export const columns: ColumnDef<User>[] = [
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
        <DataTableColumnHeader column={column} title="Name" />
      </div>
    ),
    filterFn: (row, id, filterValue) => {
      return (filterValue as string[]).includes(row.getValue(id));
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => {
      const email = getValue() as string;
      return <span className="text-sm">{email}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const role = getValue() as string;
      return (
        <span
          className={`rounded px-2 py-1 text-xs font-medium ${
            role === "admin"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {role}
        </span>
      );
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return <UserActionCell user={user} />;
    },
  },
];
