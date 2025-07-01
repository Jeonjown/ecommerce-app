import { Request, Response } from 'express';
import pool from '../db';

export const printTest = (req: Request, res: Response) => {
  res.json({ message: 'hello world' });
};

export const testDbConnection = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    res.json(rows);
  } catch (error) {
    console.error('Connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
};
