import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import { getUserById } from './userModel';

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

export const signupUser = async (
  name: string,
  validEmail: string,
  hashPassword: string
) => {
  const [result]: [ResultSetHeader, any] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, validEmail, hashPassword]
  );

  const newUser = await getUserById(result.insertId);

  return newUser;
};
