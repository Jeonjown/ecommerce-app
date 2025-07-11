import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      throw new ApiError('Not authenticated. No token provided.', 401);
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError('No JWT secret configured.', 500);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id?: number;
    };

    if (!decoded || typeof decoded.id !== 'number') {
      throw new ApiError('Invalid token payload.', 401);
    }

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    next(error);
  }
};
