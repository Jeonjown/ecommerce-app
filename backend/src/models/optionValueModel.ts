import { ResultSetHeader } from 'mysql2/promise';
import pool from '../db';
import { generateSlug } from '../utils/generateSlug';

// Get all values for a given option (e.g., for "Color", get "Black", "White")
export const getOptionValuesByOptionId = async (optionId: number) => {
  const [rows] = await pool.query(
    `SELECT * FROM product_option_values WHERE product_option_id = ?`,
    [optionId]
  );
  return rows;
};

// Create a value for a specific option
export const createOptionValue = async (
  optionId: number,
  value: string
): Promise<number> => {
  const slug = await generateSlug(value, 'product_option_values');
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO product_option_values (product_option_id, value, slug) VALUES (?, ?, ?)`,
    [optionId, value, slug]
  );
  return result.insertId;
};

// Delete all values for an option
export const deleteOptionValuesByOptionId = async (optionId: number) => {
  const [result] = await pool.query(
    `DELETE FROM product_option_values WHERE product_option_id = ?`,
    [optionId]
  );
  return result;
};
