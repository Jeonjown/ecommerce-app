import React from "react";
import type { Column } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColumnSelectFilterProps<TData> {
  column: Column<TData, unknown>;
  options: string[]; // derived from data
  placeholder?: string; // e.g. "Payment status"
  className?: string;
}

export function ColumnSelectFilter<TData>({
  column,
  options,
  placeholder = "Filter",
  className,
}: ColumnSelectFilterProps<TData>) {
  // current filter value for the column (string | undefined)
  const current = (column.getFilterValue() as string | undefined) ?? undefined;

  const setValue = (v?: string) => {
    if (v === undefined) column.setFilterValue(undefined);
    else column.setFilterValue(v);
  };

  return (
    <div className="flex items-center">
      <Select
        value={current}
        onValueChange={(v) => {
          setValue(v);
        }}
      >
        <SelectTrigger
          className={`rounded-full bg-neutral-100 text-sm font-semibold !text-black ${className ?? ""}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="min-w-[150px] text-black">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ColumnSelectFilter;
