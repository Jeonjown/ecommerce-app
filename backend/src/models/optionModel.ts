import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import { OptionGroup } from '../types/models/options';
import { VariantOption } from '../types/models/products';

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

export const getAllOptions = async (): Promise<OptionGroup[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
    po.id AS option_id,
    po.name AS option_name,
    pov.id AS value_id,
    pov.value AS value_name
  FROM product_options AS po
  LEFT JOIN product_option_values AS pov
    ON po.id = pov.product_option_id`
  );

  const groups = rows.reduce<OptionGroup[]>((acc, row) => {
    let option = acc.find((o) => o.option_id === row.option_id);

    if (!option) {
      option = {
        option_id: row.option_id,
        option_name: row.option_name,
        values: [],
      };
      acc.push(option);
    }

    if (row.value_id && row.value_name) {
      option.values.push({
        value_id: row.value_id,
        value_name: row.value_name,
      });
    }

    return acc;
  }, []);

  return groups;
};

export const getOptionsandValuesByProductId = async (
  id: number
): Promise<OptionGroup[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT 
    po.id AS option_id,
    po.name AS option_name,
    pov.id AS value_id,
    pov.value AS value_name
  FROM product_options AS po
  LEFT JOIN product_option_values AS pov
    ON po.id = pov.product_option_id
  WHERE po.product_id = ?`,
    [id]
  );

  const groups = rows.reduce<OptionGroup[]>((acc, row) => {
    const option = acc.find((o) => o.option_id === row.option_id);

    const hasValidValue = row.value_id !== null && row.value_name !== null;

    if (!option) {
      acc.push({
        option_id: row.option_id,
        option_name: row.option_name,
        values: hasValidValue
          ? [
              {
                value_id: row.value_id,
                value_name: row.value_name,
              },
            ]
          : [],
      });
    } else if (hasValidValue) {
      option.values.push({
        value_id: row.value_id,
        value_name: row.value_name,
      });
    }

    return acc;
  }, []);

  return groups;
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
  return result.insertId;
};

// Delete options for a product
export const deleteOptionsByOptionsId = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM product_options WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};
