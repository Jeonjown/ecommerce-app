import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type FiltersProps = {
  sortOrder: string;
  priceRange: string;
  onSortChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
};

const Filters = ({
  sortOrder,
  priceRange,
  onSortChange,
  onPriceRangeChange,
}: FiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Sort */}
      <Select value={sortOrder} onValueChange={onSortChange}>
        <SelectTrigger className="rounded-full bg-neutral-100 text-sm font-medium !text-black shadow-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="az">A–Z</SelectItem>
          <SelectItem value="za">Z–A</SelectItem>
          <SelectItem value="low-to-high">Price: Low to High</SelectItem>
          <SelectItem value="high-to-low">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Price Range */}
      <Select value={priceRange} onValueChange={onPriceRangeChange}>
        <SelectTrigger className="rounded-full bg-neutral-100 text-sm font-medium !text-black shadow-sm">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="0-500">₱0 – ₱500</SelectItem>
          <SelectItem value="501-1000">₱501 – ₱1000</SelectItem>
          <SelectItem value="1001-2000">₱1001 – ₱2000</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
