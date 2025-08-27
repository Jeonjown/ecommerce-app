import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
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

export const getVariantById = async (variantId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM product_variants WHERE id = ?`,
    [variantId]
  );

  return (rows as ProductVariant[])[0];
};

export const createVariant = async (
  product_id: number,
  sku: string,
  price: number,
  stock: number,
  image_url: string,
  is_active: boolean,
  name: string,
  description: string
) => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO product_variants (product_id, sku, price, stock, image_url, is_active, name, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [product_id, sku, price, stock, image_url, is_active, name, description]
  );

  return result.insertId;
};

export const updateVariant = async (
  id: number,
  sku: string,
  price: number,
  stock: number,
  image_url: string,
  is_active: boolean,
  name: string,
  description: string
) => {
  // Build sql and values first
  const sql = `UPDATE product_variants
     SET sku = ?, price = ?, stock = ?, image_url = ?, is_active = ?, name = ?, description = ?
     WHERE id = ?`;

  const values = [
    sku,
    price,
    stock,
    image_url,
    is_active,
    name,
    description,
    id,
  ];

  try {
    const [result] = await pool.query<ResultSetHeader>(sql, values);
    return result.affectedRows > 0;
  } catch (err) {
    // Log DB error details (mysql2 often provides err.sql / err.code / err.errno)
    console.error(
      '[variantModel.updateVariant] DB error:',
      (err as any).message
    );
    console.error('[variantModel.updateVariant] err.sql:', (err as any).sql);
    console.error(
      '[variantModel.updateVariant] err.code/errno:',
      (err as any).code,
      (err as any).errno
    );
    throw err;
  }
};

export const deleteVariantById = async (id: number) => {
  await pool.query(`DELETE FROM product_variants WHERE id = ?`, [id]);
};

export const getVariantOptionsByVariantId = async (variantId: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT 
      po.id AS option_id,
      po.name AS option_name,
      pov.id AS value_id,
      pov.value AS value_name
    FROM product_variant_values pvv
    JOIN product_option_values pov ON pvv.product_option_value_id = pov.id
    JOIN product_options po ON pov.product_option_id = po.id
    WHERE pvv.product_variant_id = ?
    `,
    [variantId]
  );

  const grouped = rows.reduce((acc: any[], row) => {
    const existingOption = acc.find((opt) => opt.option_id === row.option_id);
    const value = {
      value_id: row.value_id,
      value_name: row.value_name,
    };

    if (existingOption) {
      existingOption.values.push(value);
    } else {
      acc.push({
        option_id: row.option_id,
        option_name: row.option_name,
        values: [value],
      });
    }

    return acc;
  }, []);

  return grouped;
};

export async function deductVariantStock(
  variantId: number,
  quantity: number,
  connection: PoolConnection
) {
  const [result] = await connection.query<ResultSetHeader>(
    `UPDATE product_variants
     SET stock = stock - ?
     WHERE id = ? AND stock >= ?`,
    [quantity, variantId, quantity]
  );

  return result.affectedRows > 0;
}
