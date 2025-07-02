import pool from '../db';
import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(
    'SELECT id, name, email, created_at FROM users'
  );
  return rows;
};
