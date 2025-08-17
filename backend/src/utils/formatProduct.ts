import {
  ProductVariantWithOptions,
  ProductWithVariantsAndOptions,
} from '../types/models/products';
import { fromCents } from './priceConverter';

// format a single variant's price
export function formatVariant(variant: ProductVariantWithOptions) {
  return {
    ...variant,
    price: fromCents(variant.price),
  };
}

// format a product + its variants
export function formatProduct(product: ProductWithVariantsAndOptions) {
  return {
    ...product,
    variants: product.variants.map(formatVariant),
  };
}
