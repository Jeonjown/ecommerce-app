import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Column } from "@tanstack/react-table";

interface CategoryFilterProps<TData> {
  column?: Column<TData, unknown>;
  options: string[]; // list of categories to filter
}

export function CategoryFilter<TData>({
  column,
  options,
}: CategoryFilterProps<TData>) {
  const selectedValues = new Set((column?.getFilterValue() as string[]) ?? []);

  const toggleOption = (option: string) => {
    const newValues = new Set(selectedValues);
    if (newValues.has(option)) {
      newValues.delete(option);
    } else {
      newValues.add(option);
    }
    column?.setFilterValue(Array.from(newValues));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="mx-2 text-sm">
          Filter Category
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selectedValues.has(option)}
            onCheckedChange={() => toggleOption(option)}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
