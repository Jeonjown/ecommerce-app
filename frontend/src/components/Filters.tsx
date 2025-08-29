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

// Configurable price ranges
const PRICE_RANGES = [
  { label: "All Prices", value: "default" },
  { label: "₱0 – ₱1,000", value: "0-1000" },
  { label: "₱1,001 – ₱5,000", value: "1001-5000" },
  { label: "₱5,001 – ₱10,000", value: "5001-10000" },
  { label: "₱10,001 – ₱25,000", value: "10001-25000" },
  { label: "₱25,001 – ₱50,000", value: "25001-50000" },
  { label: "₱50,001 – ₱100,000", value: "50001-100000" },
  { label: "₱100,001+", value: "100001-1000000" },
];

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
          {PRICE_RANGES.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
