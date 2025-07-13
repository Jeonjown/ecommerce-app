import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db';
import { getUserByEmail, getUserById } from './userModel';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError';
import { User } from '../types/models/user';

export const signupUser = async (
  name: string,
  validEmail: string,
  hashPassword: string
): Promise<User> => {
  const foundUser = await getUserByEmail(validEmail);
  if (foundUser) {
    throw new ApiError('Email already in used. Please try another one', 401);
  }

  const [result]: [ResultSetHeader, any] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, validEmail, hashPassword]
  );

  const newUser = await getUserById(result.insertId);

  if (!newUser) {
    throw new ApiError('Failed to fetch newly created user.', 500);
  }

  return newUser;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<Omit<User, 'password'>> => {
  // find email and password if match
  const foundUser = await getUserByEmail(email);

  if (!foundUser) {
    throw new ApiError('User not found, please sign up first.', 401);
  }

  const passwordMatch = await bcrypt.compare(password, foundUser.password);

  if (!passwordMatch) {
    throw new ApiError('Invalid credentials', 401);
  }

  const { password: _, ...userWithoutPassword } = foundUser;

  return userWithoutPassword;
};
