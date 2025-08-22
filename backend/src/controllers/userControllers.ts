// controllers/userController.ts
import { NextFunction, Request, Response } from 'express';
import {
  demoteUserRole,
  getAllUsers,
  getUserById,
  promoteUserRole,
} from '../models/userModel';
import { ApiError } from '../utils/ApiError';
import { AuthenticatedRequest } from '../middlewares/authenticateUser';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../db';
import { User } from '../types/models/user';

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    next(new ApiError('Failed to fetch users', 500));
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
    next(new ApiError('Failed to fetch user.', 500));
  }
};

export const getUserByIdController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await getUserById(Number(id));

    if (!user) {
      throw new ApiError('User not found.', 404);
    }

    res.status(200).json({ user, message: 'User successfully fetched.' });
  } catch (error) {
    next(error);
  }
};

export const promoteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const updatedUser = await promoteUserRole(Number(userId));
    if (!updatedUser) {
      throw new ApiError('User not found.', 404);
    }

    res
      .status(200)
      .json({ user: updatedUser, message: 'User promoted to admin.' });
  } catch (error) {
    next(error);
  }
};

export const demoteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { user } = req as Request & { user: User };

    // Prevent self-demotion
    if (Number(userId) === user.id) {
      throw new ApiError('Admins cannot demote themselves.', 400);
    }

    const updatedUser = await demoteUserRole(Number(userId));
    if (!updatedUser) {
      throw new ApiError('User not found.', 404);
    }

    res
      .status(200)
      .json({ user: updatedUser, message: 'User demoted to user.' });
  } catch (error) {
    next(error);
  }
};
