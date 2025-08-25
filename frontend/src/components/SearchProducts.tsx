import { useGetProducts } from "@/hooks/useGetProducts";
import type { ProductWithCategory } from "@/types/api/products";
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";

const SearchProducts = () => {
  const [query, setQuery] = useState("");
  const { data } = useGetProducts();
  const [results, setResults] = useState<ProductWithCategory[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (query.trim().length > 0 && data?.products?.length) {
      const filtered = data.products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered.slice(0, 6));
    } else {
      setResults([]);
    }
  }, [query, data]);

  return (
    <div className="relative w-full md:w-[400px] lg:w-[500px]">
      {/* Search Input */}
      <div className="border-input focus-within:ring-ring flex items-center gap-2 rounded-xl border bg-white px-3 py-2 focus-within:ring-2">
        <IoSearch size={20} className="text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Search products..."
          className="placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-md">
          {results.map((p) => (
            <li
              key={p.id}
              className="hover:bg-muted-foreground/10 border-b px-4 py-2 last:border-none"
            >
              <Link
                to={`/products/${p.slug}`}
                className="flex items-center gap-3"
                onClick={() => setQuery("")}
              >
                <img
                  src={p.variants?.[0]?.image_url ?? "/placeholder.png"}
                  alt={p.name}
                  className="h-10 w-10 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {p.category?.name ?? "Uncategorized"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchProducts;
