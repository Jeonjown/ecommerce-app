import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  useReactTable,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoSearch } from "react-icons/io5";

// ---- Types ----
interface OrderLike {
  payment_method?: string | null;
  payment_status?: string | null;
  order_status?: string | null;
  refund_status?: string | null;
}

interface DataTableProps<TData extends OrderLike> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

// ---- Helper outside component ----
function extractUnique<T extends OrderLike, K extends keyof OrderLike>(
  data: T[],
  key: K,
): string[] {
  return Array.from(
    new Set(
      data
        .map((row) => row[key] ?? "")
        .filter((val): val is string => Boolean(val)),
    ),
  );
}

// ---- Component ----
export function OrdersTable<TData extends OrderLike>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ---- Options ----
  const paymentMethodOptions = React.useMemo(
    () => extractUnique(data, "payment_method"),
    [data],
  );
  const paymentStatusOptions = React.useMemo(
    () => extractUnique(data, "payment_status"),
    [data],
  );
  const orderStatusOptions = React.useMemo(
    () => extractUnique(data, "order_status"),
    [data],
  );
  const refundStatusOptions = React.useMemo(
    () => extractUnique(data, "refund_status"),
    [data],
  );

  const filters = [
    {
      key: "payment_method",
      placeholder: "Payment Method",
      options: paymentMethodOptions,
    },
    {
      key: "payment_status",
      placeholder: "Payment Status",
      options: paymentStatusOptions,
    },
    {
      key: "order_status",
      placeholder: "Order Status",
      options: orderStatusOptions,
    },
    {
      key: "refund_status",
      placeholder: "Refund Status",
      options: refundStatusOptions,
    },
  ] as const;

  // ---- Render ----
  return (
    <div>
      {/* Search + Filters */}{" "}
      <div className="flex flex-wrap items-center gap-2 py-4">
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
        {filters.map(({ key, placeholder, options }) => (
          <Select
            key={key}
            value={String(table.getColumn(key)?.getFilterValue() ?? "")}
            onValueChange={(value) =>
              table
                .getColumn(key)
                ?.setFilterValue(value === "none" ? undefined : value)
            }
          >
            {" "}
            <SelectTrigger className="w-[170px]">
              {" "}
              <SelectValue placeholder={placeholder} />{" "}
            </SelectTrigger>{" "}
            <SelectContent>
              {" "}
              <SelectItem value="none">None</SelectItem>{" "}
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {" "}
                  {option}{" "}
                </SelectItem>
              ))}{" "}
            </SelectContent>{" "}
          </Select>
        ))}{" "}
        {/* Clear All Filters Button */}{" "}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setGlobalFilter("");
            table
              .getAllColumns()
              .forEach((col) => col.setFilterValue(undefined));
          }}
        >
          {" "}
          Clear All Filters{" "}
        </Button>{" "}
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
