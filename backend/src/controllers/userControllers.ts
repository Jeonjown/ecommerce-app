// controllers/userController.ts
import { NextFunction, Request, Response } from 'express';
import { getAllUsers, createUser, getUserByEmail } from '../models/userModel';
import { ApiError } from '../utils/ApiError';

export const getUsersController = async (
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

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  try {
    const user = await createUser(name, email, password);
    res.status(201).json({ user, message: 'user successfully created' });
  } catch (error) {
    console.error(error);
    next(new ApiError('Failed to create users', 500));
  }
};
