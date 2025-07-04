import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../models/userModel';
import { ApiError } from '../utils/ApiError';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}
export const checkUserRole = (...allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user || !req.user.id) {
        throw new ApiError('No authenticated user found.', 401);
      }

      const userId = req.user.id;

      const user = await getUserById(userId);

      if (!user) {
        throw new ApiError('User not found.', 404);
      }

      if (!allowedRoles.includes(user.role)) {
        throw new ApiError('Forbidden: insufficient permissions.', 403);
      }

      // Optionally, attach role to req.user
      //   req.user = {
      //     ...req.user,
      //     role: user.role,
      //   };

      next();
    } catch (error) {
      next(error);
    }
  };
};
