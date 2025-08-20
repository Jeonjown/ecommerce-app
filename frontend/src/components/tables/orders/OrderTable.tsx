import { useMemo, useState } from "react";
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
  type Column,
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
import { DataTableViewOptions } from "@/components/ui/data-table-column-toggle";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import ColumnSelectFilter from "./ColumnSelectFilter";

interface DataTableProps<TData extends object> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

/** simple global filter: substring across all values */
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

export function OrdersTable<TData extends object>({
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
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn,
  });

  // derive unique, non-empty options from data
  const paymentMethodOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (data as any[])
            .map((r) => String(r.payment_method ?? ""))
            .filter(Boolean),
        ),
      ),
    [data],
  );
  const paymentStatusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (data as any[])
            .map((r) => String(r.payment_status ?? ""))
            .filter(Boolean),
        ),
      ),
    [data],
  );
  const orderStatusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (data as any[])
            .map((r) => String(r.order_status ?? ""))
            .filter(Boolean),
        ),
      ),
    [data],
  );
  const refundStatusOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (data as any[])
            .map((r) => String(r.refund_status ?? ""))
            .filter(Boolean),
        ),
      ),
    [data],
  );

  // safe column lookup
  const findColumn = (id: string) =>
    table.getAllLeafColumns().find((c) => c.id === id) as
      | Column<TData, unknown>
      | undefined;

  const paymentMethodColumn = findColumn("payment_method");
  const paymentStatusColumn = findColumn("payment_status");
  const orderStatusColumn = findColumn("order_status");
  const refundStatusColumn = findColumn("refund_status");

  return (
    <div className="">
      {/* Header: search + filters */}
      <div className="flex items-center justify-between py-5">
        <div className="flex w-full max-w-2xl items-center gap-3">
          {/* Search input */}
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

          {/* Filters beside search; no chips, no clear-all */}
          <div className="flex items-center gap-2">
            {paymentMethodColumn && (
              <ColumnSelectFilter
                column={paymentMethodColumn}
                options={paymentMethodOptions}
                placeholder="Payment method"
              />
            )}

            {paymentStatusColumn && (
              <ColumnSelectFilter
                column={paymentStatusColumn}
                options={paymentStatusOptions}
                placeholder="Payment status"
              />
            )}

            {orderStatusColumn && (
              <ColumnSelectFilter
                column={orderStatusColumn}
                options={orderStatusOptions}
                placeholder="Order status"
              />
            )}

            {refundStatusColumn && (
              <ColumnSelectFilter
                column={refundStatusColumn}
                options={refundStatusOptions}
                placeholder="Refund status"
              />
            )}
          </div>
        </div>

        <DataTableViewOptions table={table} />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="max-h-[65vh] overflow-y-auto">
          <Table>
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

        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

export default OrdersTable;
