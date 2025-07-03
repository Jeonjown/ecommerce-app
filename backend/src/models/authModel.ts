import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import { getUserByEmail, getUserById } from './userModel';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError';

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

export const loginUser = async (email: string, password: string) => {
  // find email and password if match
  const foundUser = await getUserByEmail(email);

  if (!foundUser) {
    throw new ApiError('user not found', 401);
  }

  const passwordMatch = await bcrypt.compare(password, foundUser.password);

  if (!passwordMatch) {
    throw new ApiError('Invalid credentials', 401);
  }

  const { password: _, ...userWithoutPassword } = foundUser;

  return userWithoutPassword;
};
