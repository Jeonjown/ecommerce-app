import pool from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { User } from '../types/models/user';

type UserRow = User & RowDataPacket;

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query<UserRow[]>(
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

  const [rows] = await pool.query<UserRow[]>(
    `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
    [result.insertId]
  );

  return rows[0];
};

export const getUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT id, name, email, role, created_at, password FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

export const getUserById = async (
  resultId: number
): Promise<User | undefined> => {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [resultId]
  );
  return rows[0];
};

// promote user to admin
export const promoteUserRole = async (
  userId: number
): Promise<User | undefined> => {
  await pool.query<ResultSetHeader>(
    "UPDATE users SET role = 'admin' WHERE id = ?",
    [userId]
  );

  const [rows] = await pool.query<(User & RowDataPacket)[]>(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  return rows[0];
};

// demote user back to normal user
export const demoteUserRole = async (
  userId: number
): Promise<User | undefined> => {
  await pool.query<ResultSetHeader>(
    "UPDATE users SET role = 'user' WHERE id = ?",
    [userId]
  );

  const [rows] = await pool.query<(User & RowDataPacket)[]>(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  return rows[0];
};
