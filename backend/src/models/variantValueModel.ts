import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import { VariantOption } from '../types/models/products';

// Get all variant values for a given product variant
export const getVariantValuesByVariantId = async (
  variantId: number
): Promise<VariantOption[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
       pov.id   AS option_value_id,
       pov.value AS option_value,
       po.id    AS option_id,
       po.name  AS option_name
     FROM product_variant_values pvv
     JOIN product_options po
       ON pvv.product_option_id = po.id
     JOIN product_option_values pov
       ON pvv.product_option_value_id = pov.id
     WHERE pvv.product_variant_id = ?`,
    [variantId]
  );
  return rows as VariantOption[];
};

export const createVariantValue = async (
  product_variant_id: number,
  product_option_id: number,
  product_option_value_id: number
): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO product_variant_values (product_variant_id, product_option_id, product_option_value_id)
     VALUES (?, ?, ?)`,
    [product_variant_id, product_option_id, product_option_value_id]
  );
  return result.insertId;
};

// Create multiple variant values for a product variant
export const createVariantValues = async (
  variantId: number,
  values: { product_option_id: number; product_option_value_id: number }[]
) => {
  const insertValues = values.map(() => `(?, ?, ?)`).join(', ');

  const params = values.flatMap((v) => [
    variantId,
    v.product_option_id,
    v.product_option_value_id,
  ]);

  const [result] = await pool.query(
    `INSERT INTO product_variant_values (product_variant_id, product_option_id, product_option_value_id) VALUES ${insertValues}`,
    params
  );

  return result;
};

// Delete all variant values by product_variant_id
export const deleteVariantValuesByVariantId = async (variantId: number) => {
  const [result] = await pool.query(
    `DELETE FROM product_variant_values WHERE product_variant_id = ?`,
    [variantId]
  );
  return result;
};
