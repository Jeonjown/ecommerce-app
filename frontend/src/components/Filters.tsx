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
  availability: string;
  onSortChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
};

const Filters = ({
  sortOrder,
  priceRange,
  availability,
  onSortChange,
  onPriceRangeChange,
  onAvailabilityChange,
}: FiltersProps) => {
  return (
    <div className="flex space-x-4">
      {/* Sort */}
      <Select value={sortOrder} onValueChange={onSortChange}>
        <SelectTrigger className="rounded-full bg-neutral-100 font-semibold !text-black">
          <SelectValue placeholder="Sort Order" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="az">A-Z</SelectItem>
          <SelectItem value="za">Z-A</SelectItem>
          <SelectItem value="low-to-high">Price: Low to High</SelectItem>
          <SelectItem value="high-to-low">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Price Range */}
      <Select value={priceRange} onValueChange={onPriceRangeChange}>
        <SelectTrigger className="rounded-full bg-neutral-100 font-semibold !text-black">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="0-500">₱0 – ₱500</SelectItem>
          <SelectItem value="501-1000">₱501 – ₱1000</SelectItem>
          <SelectItem value="1001-2000">₱1001 – ₱2000</SelectItem>
        </SelectContent>
      </Select>

      {/* Availability */}
      <Select value={availability} onValueChange={onAvailabilityChange}>
        <SelectTrigger className="rounded-full bg-neutral-100 font-semibold !text-black">
          <SelectValue placeholder="Availability" />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectItem value="in-stock">In Stock</SelectItem>
          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
