import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type Column,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@/types/api/user";
import ColumnSelectFilter from "../orders/ColumnSelectFilter";
import { IoSearch } from "react-icons/io5";

// 🔹 Role filter wrapper
function RoleFilter({
  column,
  options,
}: {
  column: Column<User, unknown>;
  options: string[];
}) {
  return (
    <ColumnSelectFilter<User>
      column={column}
      options={options}
      placeholder="Role"
      className="w-[120px]"
    />
  );
}
interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
}

export function UserTable({ columns, data }: DataTableProps<User>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const roleOptions = ["admin", "user"];

  // 🔹 Narrow role column safely
  const roleColumn = table.getColumn("role") as
    | Column<User, unknown>
    | undefined;

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="relative mr-3 w-full max-w-xs">
          <IoSearch
            size={16}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="py-2 text-sm"
          />
        </div>

        {roleColumn && <RoleFilter column={roleColumn} options={roleOptions} />}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
