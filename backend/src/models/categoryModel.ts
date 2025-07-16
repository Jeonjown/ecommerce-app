import { ResultSetHeader, FieldPacket } from 'mysql2/promise';
import pool from '../db';
import type { Categories } from '../types/models/categories';

export const getCategories = async (): Promise<Categories[]> => {
  const [rows] = await pool.query('SELECT * FROM categories');
  return rows as Categories[];
};

export const getCategoryById = async (
  id: number
): Promise<Categories | null> => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [
    id,
  ]);

  const categories = rows as Categories[];
  return categories[0] ?? null;
};

export const getCategoryBySlug = async (
  slug: string
): Promise<Categories | null> => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [
    slug,
  ]);

  const categories = rows as Categories[];
  return categories[0] ?? null;
};

export const createCategory = async (
  name: string,
  slug: string
): Promise<Categories> => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO categories (name, slug) VALUES (?, ?)',
    [name, slug]
  );

  const insertId = result.insertId;
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [
    insertId,
  ]);

  return (rows as Categories[])[0];
};

export const editCategory = async (
  id: number,
  fields: { name: string; slug: string }
): Promise<Categories | null> => {
  // Perform the update
  const [result] = await pool.query('UPDATE categories SET ? WHERE id = ?', [
    fields,
    id,
  ]);

  const updateResult = result as ResultSetHeader;

  if (updateResult.affectedRows === 0) {
    return null;
  }

  // Fetch the updated row
  const [rawRows] = await pool.query('SELECT * FROM categories WHERE id = ?', [
    id,
  ]);

  const rows = rawRows as Categories[];

  return rows[0] ?? null;
};

export const deleteCategoryById = async (
  id: number
): Promise<ResultSetHeader> => {
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [
    id,
  ]);

  return result as ResultSetHeader;
};
