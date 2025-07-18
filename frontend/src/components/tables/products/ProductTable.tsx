import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type Row,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { IoSearch } from "react-icons/io5";

import { useState } from "react";
import { DataTableViewOptions } from "@/components/ui/data-table-column-toggle";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { CategoryFilter } from "@/components/ui/category-filter";

interface DataTableProps<TData extends object> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

/** Global filter: checks every value in the row for a substring match */
function globalFilterFn<TData extends object>(
  row: Row<TData>,
  _columnId: string,
  filterValue: string,
): boolean {
  const search = filterValue.toLowerCase();
  return Object.values(row.original).some((val) =>
    String(val).toLowerCase().includes(search),
  );
}

export function ProductTable<TData extends object>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,

    // Core and feature row models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // Use our global filter function
    globalFilterFn,
  });

  const categoryOptions = [
    ...new Set(
      data.map(
        (row) =>
          (row as { category?: { name?: string } }).category?.name ?? "N/A",
      ),
    ),
  ];

  return (
    <div className="">
      {/* Global Search & View Options */}
      <div className="flex items-center justify-between py-5">
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
        <CategoryFilter
          column={table.getColumn("category")}
          options={categoryOptions}
        />

        <DataTableViewOptions table={table} />
      </div>

      {/* Table Container */}
      <div className="rounded-md border">
        {/* Scrollable Data Area */}
        <div className="max-h-[65vh] overflow-y-auto">
          <Table>
            {/* Sticky Header */}
            <TableHeader className="sticky top-0 z-10 bg-white">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className="px-5">
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

            {/* Table Body */}
            <TableBody>
              {table.getRowModel().rows.length ? (
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

        {/* Pagination Controls */}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
