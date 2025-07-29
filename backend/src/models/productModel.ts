import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import {
  Product,
  ProductVariant,
  VariantOption,
  ProductOptionWithValues,
  ProductWithCategory,
} from '../types/models/products';

export const createProduct = async (
  category_id: number,
  name: string,
  slug: string,
  description: string,
  is_active: boolean
): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO products (category_id, name, slug, description, is_active)
  VALUES (?, ?, ?, ?, ?)`,
    [category_id, name, slug, description, is_active]
  );
  return result.insertId;
};

export const getProducts = async (): Promise<ProductWithCategory[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
       p.id, p.name, p.slug, p.description, p.is_active,
       c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
       c.created_at AS category_created_at, c.updated_at AS category_updated_at
     FROM products p
     JOIN categories c ON p.category_id = c.id`
  );

  const fullProducts: ProductWithCategory[] = [];

  for (const row of rows) {
    const product: ProductWithCategory = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      is_active: !!row.is_active,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        created_at: row.category_created_at,
        updated_at: row.category_updated_at,
      },
    };

    const variants = await getProductVariants(product.id);
    const options = await getProductOptions(product.id);

    fullProducts.push({
      ...product,
      variants,
      options,
    });
  }

  return fullProducts;
};

export const getProductBySlug = async (
  slug: string
): Promise<Product | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM products WHERE slug = ? LIMIT 1`,
    [slug]
  );

  const products = rows as Product[];

  return products.length > 0 ? products[0] : null;
};
// Get single product by ID with variants and options
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
