import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import { ProductVariant } from '../types/models/products';

export const getVariantsByProductId = async (
  productId: number
): Promise<ProductVariant[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM product_variants WHERE product_id = ?`,
    [productId]
  );

  return rows as ProductVariant[];
};

export const getVariantById = async (id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM product_variants WHERE id = ?`,
    [id]
  );

  return (rows as ProductVariant[])[0];
};
export const createVariant = async (
  product_id: number,
  sku: string,
  price: number,
  stock: number,
  image_url: string,
  is_active: number
) => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO product_variants (product_id, sku, price, stock, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
    [product_id, sku, price, stock, image_url, is_active]
  );
  return result.insertId;
};

export const updateVariant = async (
  id: number,
  sku: string,
  price: number,
  stock: number,
  image_url: string,
  is_active: number
) => {
  await pool.query(
    `UPDATE product_variants SET sku = ?, price = ?, stock = ?, image_url = ?, is_active = ? WHERE id = ?`,
    [sku, price, stock, image_url, is_active, id]
  );
};

export const deleteVariant = async (id: number) => {
  await pool.query(`DELETE FROM product_variants WHERE id = ?`, [id]);
};
