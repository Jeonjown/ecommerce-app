import type { Column } from "@tanstack/react-table";
import { ColumnSelectFilter } from "../orders/ColumnSelectFilter";
import type { User } from "@/types/api/user";

export function RoleFilter({ column }: { column: Column<User, unknown> }) {
  return (
    <ColumnSelectFilter<User>
      column={column}
      options={["admin", "user"]}
      placeholder="Role"
      className="w-[120px]"
    />
  );
}
