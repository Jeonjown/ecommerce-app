import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';

// Get all options for a product
export const getOptionsByProductId = async (
  productId: number
): Promise<RowDataPacket[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM product_options WHERE product_id = ?`,
    [productId]
  );
  return rows;
};
// Create an option for a product (e.g., Color, Size)
export const createOption = async (
  productId: number,
  name: string
): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO product_options (product_id, name) VALUES (?, ?)`,
    [productId, name]
  );
  return result.insertId; // ✅ Must return number
};
// Delete options for a product
export const deleteOptionsByProductId = async (productId: number) => {
  const [result] = await pool.query(
    `DELETE FROM product_options WHERE product_id = ?`,
    [productId]
  );
  return result;
};
