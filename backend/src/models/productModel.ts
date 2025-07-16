import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import { Product } from '../types/models/products';
import { ApiError } from '../utils/ApiError';

export const getProducts = async (): Promise<Product[]> => {
  const [rows] = await pool.query('SELECT * FROM products');
  return rows as Product[];
};

export const getProduct = async (id: number): Promise<Product | null> => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  const products = rows as Product[];

  return products.length ? products[0] : null;
};

export const searchProducts = async (keyword: string): Promise<Product[]> => {
  const searchPattern = `%${keyword}%`;

  const [rows] = await pool.query(
    `SELECT * FROM products 
     WHERE name LIKE ? OR description LIKE ?`,
    [searchPattern, searchPattern]
  );

  return rows as Product[];
};

export const getProductsByCategory = async (
  category_id: number
): Promise<Product[]> => {
  const [rows] = await pool.query(
    'SELECT * FROM products WHERE category_id = ?',
    [category_id]
  );

  return rows as Product[];
};

export const createProduct = async (
  payload: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<Product> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO products 
    (category_id, name, description, price, stock, image_url, is_active, slug, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      payload.category_id,
      payload.name,
      payload.description,
      payload.price,
      payload.stock,
      payload.image_url,
      payload.is_active,
      payload.slug,
    ]
  );

  const insertedProduct = await getProduct(result.insertId);

  if (!insertedProduct) {
    throw new Error('Failed to retrieve the inserted product.');
  }

  return insertedProduct;
};

export const editProduct = async (
  id: number,
  payload: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<Product> => {
  const fieldsToUpdate = {
    ...payload,
    updated_at: new Date(),
  };

  // Run the UPDATE query
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE products SET ? WHERE id = ?',
    [fieldsToUpdate, id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError('Product not found or no changes were made.', 404);
  }

  // Fetch the updated product
  const updatedProduct = await getProduct(id);

  if (!updatedProduct) {
    throw new ApiError('Failed to retrieve updated product.', 404);
  }

  return updatedProduct;
};

export const deleteProduct = async (id: number): Promise<Product> => {
  const product = await getProduct(id);

  if (!product) {
    throw new ApiError('Product not found.', 404);
  }

  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM products WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError('Product not deleted.', 500);
  }

  return product;
};
