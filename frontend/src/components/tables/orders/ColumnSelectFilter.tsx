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
  options: string[];
  placeholder?: string; // e.g. "Payment status"
  className?: string;
}

export function ColumnSelectFilter<TData>({
  column,
  options,
  placeholder = "Filter",
  className,
}: ColumnSelectFilterProps<TData>) {
  const current = (column.getFilterValue() as string | undefined) ?? undefined;

  const setValue = (v?: string) => {
    if (v === "__none__")
      column.setFilterValue(undefined); // reset
    else column.setFilterValue(v);
  };

  return (
    <Select value={current ?? "__none__"} onValueChange={(v) => setValue(v)}>
      <SelectTrigger
        className={`rounded-full bg-neutral-100 text-sm font-semibold !text-black ${className ?? ""}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="min-w-[150px] text-black">
        {/* Reset option */}
        <SelectItem value="__none__">{placeholder}</SelectItem>

        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ColumnSelectFilter;
