import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload;
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
      throw new ApiError('No JWT provided', 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    next(new ApiError('Invalid or expired token.', 401));
  }
};
