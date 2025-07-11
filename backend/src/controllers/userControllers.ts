// controllers/userController.ts
import { NextFunction, Request, Response } from 'express';
import { getAllUsers, createUser, getUserById } from '../models/userModel';
import { ApiError } from '../utils/ApiError';
import { AuthenticatedRequest } from '../middlewares/authenticateUser';

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
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
    if (!name || !email || !password) {
      throw new ApiError('Please provide all required fields', 400);
    }
    const user = await createUser(name, email, password);
    res.status(201).json({ user, message: 'user successfully created' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const getLoggedInUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError('Unauthorized.', 401);
    }

    const user = await getUserById(req.user.id);

    if (!user) {
      throw new ApiError('User not found.', 404);
    }

    res.status(200).json({ user, message: 'User successfully fetched.' });
  } catch (error) {
    console.error(error);
    next(new ApiError('Failed to fetch user.', 500));
  }
};
