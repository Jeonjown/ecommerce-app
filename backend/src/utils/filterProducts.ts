import { ProductWithCategory } from '../types/models/products';
import { getLowestPrice } from './getLowestPrice';
import { toCents } from './priceConverter';

type Filters = {
  dateOrder?: string;
  priceRange?: string;
  sort?: string;
};

export function filterProducts(
  products: ProductWithCategory[],
  filters: Filters
): ProductWithCategory[] {
  let filtered = [...products];

  // Price range filtering
  if (filters.priceRange) {
    const [min, max] = filters.priceRange
      .split('-')
      .map((v) => toCents(Number(v)));
    filtered = filtered.filter((product) =>
      product.variants.some((v) => v.price >= min && v.price <= max)
    );
  }

  // Sort order (name or price)
  switch (filters.sort) {
    case 'low-to-high':
      filtered.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
      break;
    case 'high-to-low':
      filtered.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
      break;
    case 'az':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'za':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  return filtered;
}
