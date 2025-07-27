import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import { ProductVariant, VariantOption } from '../types/models/products';

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
  is_active: boolean
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
  is_active: boolean
) => {
  const [result] = await pool.query(
    `UPDATE product_variants SET sku = ?, price = ?, stock = ?, image_url = ?, is_active = ? WHERE id = ?`,
    [sku, price, stock, image_url, is_active, id]
  );

  return (result as any).affectedRows > 0;
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
