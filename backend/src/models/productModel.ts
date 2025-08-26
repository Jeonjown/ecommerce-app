import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import {
  Product,
  ProductVariant,
  VariantOption,
  ProductOptionWithValues,
  ProductWithCategory,
  ProductFilters,
  ProductWithVariantsAndOptions,
  ProductVariantWithOptions,
  GroupedProductOption,
  ProductOptionValue,
} from '../types/models/products';
import { getLowestPrice } from '../utils/getLowestPrice';
import { filterProducts } from '../utils/filterProducts';
import { getVariantValuesByVariantId } from './variantValueModel';
import { getVariantsByProductId } from './variantModel';
import { getOptionsByProductId } from './optionModel';
import { getOptionValuesByOptionId } from './optionValueModel';

export const createProduct = async (
  category_id: number,
  name: string,
  brand: string,
  slug: string,
  description: string,
  is_active: boolean
): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO products (category_id, name, brand, slug, description, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [category_id, name, brand, slug, description, is_active]
  );
  return result.insertId;
};

export const getProductsByCategoryId = async (
  categoryId: number,
  filters: ProductFilters = {}
): Promise<ProductWithCategory[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
  SELECT 
    p.id, p.name, p.slug, p.description, p.is_active, p.created_at,
    c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
    c.created_at AS category_created_at, c.updated_at AS category_updated_at
  FROM products p
  JOIN categories c ON p.category_id = c.id
  WHERE p.category_id = ?
    `,
    [categoryId]
  );

  const fullProducts: ProductWithCategory[] = [];

  for (const row of rows) {
    const product: ProductWithCategory = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      is_active: !!row.is_active,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        created_at: row.category_created_at,
        updated_at: row.category_updated_at,
      },
      variants: [],
      options: [],
    };

    const variants = await getProductVariants(product.id);
    const options = await getProductOptions(product.id);

    fullProducts.push({
      ...product,
      variants,
      options,
    });
  }

  const filtered = filterProducts(fullProducts, filters);

  return filtered;
};

export const getProducts = async (
  filters: ProductFilters = {}
): Promise<ProductWithCategory[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT 
      p.id, p.name, p.slug, p.description, p.is_active, p.created_at, p.updated_at,
      c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
      c.created_at AS category_created_at, c.updated_at AS category_updated_at
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `);

  if (!rows.length) return [];

  const productIds = rows.map((r) => r.id);

  // Fetch all variants for all products
  const [variantRows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM product_variants WHERE product_id IN (?)`,
    [productIds]
  );

  // Fetch all variant option values for all variants
  const variantIds = variantRows.map((v) => v.id);
  const [variantOptionRows] = await pool.query<RowDataPacket[]>(
    `SELECT 
       pvv.product_variant_id,
       po.id AS option_id,
       po.name AS option_name,
       pov.id AS option_value_id,
       pov.value AS option_value
     FROM product_variant_values pvv
     JOIN product_options po ON po.id = pvv.product_option_id
     JOIN product_option_values pov ON pov.id = pvv.product_option_value_id
     WHERE pvv.product_variant_id IN (?)`,
    [variantIds]
  );

  // Fetch all product options & values for all products
  const [productOptionRows] = await pool.query<RowDataPacket[]>(
    `SELECT 
       po.product_id,
       po.id AS option_id,
       po.name AS option_name,
       pov.id AS option_value_id,
       pov.value AS option_value
     FROM product_options po
     JOIN product_option_values pov ON pov.product_option_id = po.id
     WHERE po.product_id IN (?)`,
    [productIds]
  );

  // Group data
  const variantsMap: Record<number, ProductVariant[]> = {};
  variantRows.forEach((v) => {
    variantsMap[v.product_id] = variantsMap[v.product_id] || [];
    variantsMap[v.product_id].push({
      id: v.id,
      product_id: v.product_id,
      name: v.name,
      description: v.description,
      sku: v.sku,
      price: v.price,
      stock: v.stock,
      image_url: v.image_url,
      is_active: !!v.is_active,
      options: variantOptionRows
        .filter((o) => o.product_variant_id === v.id)
        .map((o) => ({
          option_id: o.option_id,
          option_name: o.option_name,
          option_value_id: o.option_value_id,
          option_value: o.option_value,
        })),
    });
  });

  const optionsMap: Record<number, ProductOptionWithValues[]> = {};
  productOptionRows.forEach((o) => {
    optionsMap[o.product_id] = optionsMap[o.product_id] || [];
    optionsMap[o.product_id].push({
      option_id: o.option_id,
      option_name: o.option_name,
      option_value_id: o.option_value_id,
      option_value: o.option_value,
    });
  });

  // Build products
  const products: ProductWithCategory[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    is_active: !!row.is_active,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
      created_at: row.category_created_at,
      updated_at: row.category_updated_at,
    },
    variants: variantsMap[row.id] || [],
    options: optionsMap[row.id] || [],
  }));

  return filterProducts(products, filters);
};

export const getProductBySlug = async (
  slug: string
): Promise<ProductWithVariantsAndOptions | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM products WHERE slug = ? LIMIT 1`,
    [slug]
  );

  if (!rows.length) return null;

  const raw = rows[0];

  const product: ProductWithVariantsAndOptions = {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    is_active: !!raw.is_active,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    variants: [],
    options: [],
  };

  // --- Fetch variants and their options ---
  const variants = await getVariantsByProductId(product.id);

  const variantsWithOptions: ProductVariantWithOptions[] = await Promise.all(
    variants.map(async (variant) => ({
      ...variant,
      options: await getVariantValuesByVariantId(variant.id),
    }))
  );

  product.variants = variantsWithOptions;

  // --- Fetch grouped options and values ---
  const rawOptions = await getOptionsByProductId(product.id);

  const groupedOptions: GroupedProductOption[] = await Promise.all(
    rawOptions.map(async (opt) => {
      const values = await getOptionValuesByOptionId(opt.id);
      return {
        id: opt.id,
        name: opt.name,
        values: values as ProductOptionValue[],
      };
    })
  );

  product.options = groupedOptions;

  return product;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM products WHERE id = ?`,
    [id]
  );

  if (!rows.length) return null;

  const row = rows[0];

  const product: Product = {
    id: row.id,
    category_id: row.category_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    is_active: !!row.is_active,
  };

  const variants = await getProductVariants(id);
  const options = await getProductOptions(id);

  return { ...product, variants, options };
};

export const getProductVariants = async (
  productId: number
): Promise<ProductVariant[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM product_variants WHERE product_id = ?`,
    [productId]
  );

  const variantsWithOptions: ProductVariant[] = [];

  for (const row of rows) {
    const variant: ProductVariant = {
      id: row.id,
      product_id: row.product_id,
      name: row.name,
      description: row.description,
      sku: row.sku,
      price: row.price,
      stock: row.stock,
      image_url: row.image_url,
      is_active: !!row.is_active,
    };

    const options = await getVariantOptionValues(variant.id);
    variantsWithOptions.push({ ...variant, options });
  }

  return variantsWithOptions;
};

// Get option values for a specific variant
export const getVariantOptionValues = async (
  variantId: number
): Promise<VariantOption[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
      po.id AS option_id,
      po.name AS option_name,
      pov.id AS option_value_id,
      pov.value AS option_value
    FROM product_variant_values pvv
    JOIN product_options po ON po.id = pvv.product_option_id
    JOIN product_option_values pov ON pov.id = pvv.product_option_value_id
    WHERE pvv.product_variant_id = ?`,
    [variantId]
  );

  return rows as VariantOption[];
};

// Get all available options and their values for a product
export const getProductOptions = async (
  productId: number
): Promise<ProductOptionWithValues[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
      po.id AS option_id,
      po.name AS option_name,
      pov.id AS option_value_id,
      pov.value AS option_value
    FROM product_options po
    JOIN product_option_values pov ON pov.product_option_id = po.id
    WHERE po.product_id = ?`,
    [productId]
  );

  return rows as ProductOptionWithValues[];
};

/**
 * Updates the core product row.
 */
export const updateProduct = async (
  id: number,
  payload: Partial<
    Pick<Product, 'category_id' | 'name' | 'description' | 'is_active' | 'slug'>
  >
): Promise<void> => {
  if (Object.keys(payload).length === 0) {
    throw new Error('No update fields provided');
  }

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE products SET ? WHERE id = ?`,
    [payload, id]
  );

  if (result.affectedRows === 0) {
    throw new Error('Product not found or no changes applied');
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM products WHERE id = ?`,
    [id]
  );
  if (result.affectedRows === 0) {
    throw new Error('Product not found');
  }
};
