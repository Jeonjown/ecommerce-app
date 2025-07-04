import pool from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(
    'SELECT id, name, email, role, created_at FROM users'
  );
  return rows;
};

export const createUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, password]
  );

  const [rows] = await pool.query<User[]>(
    `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
    [result.insertId]
  );

  return rows[0];
};

export const getUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const [rows] = await pool.query<User[]>(
    'SELECT id, name, email, role, created_at, password FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

export const getUserById = async (resultId: number) => {
  const [row] = await pool.query<User[]>(
    'SELECT id, name, role, created_at FROM users WHERE id = ?',
    [resultId]
  );
  return row[0];
};
