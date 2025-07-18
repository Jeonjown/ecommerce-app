import { RowDataPacket } from 'mysql2';
import pool from '../db';

export const generateSku = async (
  productName: string,
  options: { name: string; value: string }[] = []
): Promise<string> => {
  const base = productName.trim().toUpperCase().replace(/\s+/g, '-');

  const optionParts = options.map((opt) =>
    opt.value.trim().toUpperCase().replace(/\s+/g, '-')
  );

  let baseSku = [base, ...optionParts].join('-');
  let sku = baseSku;
  let counter = 1;

  while (await skuExists(sku)) {
    sku = `${baseSku}[${counter}]`;
    counter++;
  }

  return sku;
};

const skuExists = async (sku: string): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) AS count FROM product_variants WHERE sku = ?',
    [sku]
  );
  return rows[0].count > 0;
};
