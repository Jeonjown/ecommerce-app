// controllers/userController.ts
import { NextFunction, Request, Response } from 'express';
import { getAllUsers } from '../models/userModel';
import { ApiError } from '../utils/ApiError';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();

    res.json(users);
  } catch (error) {
    console.error(error);
    next(new ApiError('Failed to fetch users', 500));
  }
};
