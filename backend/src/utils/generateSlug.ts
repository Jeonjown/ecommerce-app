// src/utils/generateSlug.ts
import { RowDataPacket } from 'mysql2/promise';
import pool from '../db';

/**
 * Generate a URL‑friendly slug and ensure it’s unique in the given table.
 */
export async function generateSlug(
  name: string,
  table:
    | 'products'
    | 'categories'
    | 'product_option_values'
    | 'product_variant_values'
): Promise<string> {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  let slug = base;
  let count = 1;

  while (true) {
    // pool.query returns [rows, fields]
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM \`${table}\` WHERE slug = ?`,
      [slug]
    );
    // rows[0].cnt holds the count
    if ((rows[0] as any).cnt === 0) break;
    count += 1;
    slug = `${base}-${count}`;
  }

  return slug;
}
