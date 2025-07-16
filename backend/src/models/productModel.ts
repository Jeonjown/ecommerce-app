import { ResultSetHeader } from 'mysql2/promise';
import pool from '../db';
import { Product, ProductVariant } from '../types/models/products';
import { ApiError } from '../utils/ApiError';

// Get all products with their variants
export const getProducts = async (): Promise<Product[]> => {
  const [rows] = await pool.query('SELECT * FROM products');
  const products = rows as Product[];

  for (const product of products) {
    const [variantRows] = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = ?',
      [product.id]
    );
    product.variants = variantRows as ProductVariant[];
  }

  return products;
};

// Get a single product by ID with its variants
export const getProduct = async (id: number): Promise<Product | null> => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  const products = rows as Product[];

  if (!products.length) return null;

  const product = products[0];

  const [variantRows] = await pool.query(
    'SELECT * FROM product_variants WHERE product_id = ?',
    [id]
  );
  product.variants = variantRows as ProductVariant[];

  return product;
};

// Search products by keyword
export const searchProducts = async (keyword: string): Promise<Product[]> => {
  const searchPattern = `%${keyword}%`;

  const [rows] = await pool.query(
    `SELECT * FROM products 
     WHERE name LIKE ? OR description LIKE ?`,
    [searchPattern, searchPattern]
  );

  const products = rows as Product[];

  for (const product of products) {
    const [variantRows] = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = ?',
      [product.id]
    );
    product.variants = variantRows as ProductVariant[];
  }

  return products;
};

// Get products by category ID
export const getProductsByCategory = async (
  category_id: number
): Promise<Product[]> => {
  const [rows] = await pool.query(
    'SELECT * FROM products WHERE category_id = ?',
    [category_id]
  );

  const products = rows as Product[];

  for (const product of products) {
    const [variantRows] = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = ?',
      [product.id]
    );
    product.variants = variantRows as ProductVariant[];
  }

  return products;
};

// Create a product and its variants
export const createProduct = async (
  productPayload: Omit<
    Product,
    'id' | 'created_at' | 'updated_at' | 'variants'
  >,
  variants: Array<
    Omit<ProductVariant, 'id' | 'product_id' | 'created_at' | 'updated_at'>
  >
): Promise<Product> => {
  // Insert the product
  const [productResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO products 
     (category_id, name, description, image_url, is_active, slug, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      productPayload.category_id,
      productPayload.name,
      productPayload.description,
      productPayload.image_url,
      productPayload.is_active,
      productPayload.slug,
    ]
  );

  const insertedId = productResult.insertId;

  // Insert variants
  for (const variant of variants) {
    await pool.query(
      `INSERT INTO product_variants 
       (product_id, option1, option2, option3, price, stock, sku, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        insertedId,
        variant.option1,
        variant.option2,
        variant.option3,
        variant.price,
        variant.stock,
        variant.sku,
        variant.is_active ?? 1,
      ]
    );
  }

  const createdProduct = await getProduct(insertedId);
  if (!createdProduct)
    throw new ApiError('Failed to fetch created product.', 500);
  return createdProduct;
};

// Edit product details (not variants)
export const editProduct = async (
  id: number,
  payload: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<Product> => {
  const fieldsToUpdate = {
    ...payload,
    updated_at: new Date(),
  };

  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE products SET ? WHERE id = ?',
    [fieldsToUpdate, id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError('Product not found or no changes were made.', 404);
  }

  const updatedProduct = await getProduct(id);
  if (!updatedProduct) {
    throw new ApiError('Failed to retrieve updated product.', 404);
  }

  return updatedProduct;
};

// Edit product and replace all its variants
export const editProductWithVariants = async (
  id: number,
  productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>,
  variants: Array<
    Omit<ProductVariant, 'id' | 'product_id' | 'created_at' | 'updated_at'>
  >
): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [productResult] = await connection.query<ResultSetHeader>(
      'UPDATE products SET ? WHERE id = ?',
      [{ ...productData, updated_at: new Date() }, id]
    );

    if (productResult.affectedRows === 0) {
      throw new ApiError('Product not found.', 404);
    }

    await connection.query(
      'DELETE FROM product_variants WHERE product_id = ?',
      [id]
    );

    for (const variant of variants) {
      await connection.query(
        `INSERT INTO product_variants 
         (product_id, option1, option2, option3, price, stock, sku, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          id,
          variant.option1,
          variant.option2,
          variant.option3,
          variant.price,
          variant.stock,
          variant.sku,
          variant.is_active ?? 1,
        ]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

// Delete product and all its variants
export const deleteProduct = async (id: number): Promise<Product> => {
  const product = await getProduct(id);
  if (!product) {
    throw new ApiError('Product not found.', 404);
  }

  await pool.query('DELETE FROM product_variants WHERE product_id = ?', [id]);

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM products WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError('Product not deleted.', 500);
  }

  return product;
};
