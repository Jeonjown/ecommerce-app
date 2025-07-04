import jwt from 'jsonwebtoken';
import { ApiError } from './ApiError';

export const jwtSign = (id: number) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new ApiError(
      'JWT secret key is not defined in environment variables.',
      500
    );
  }

  const token = jwt.sign({ id }, secretKey, { expiresIn: '24h' });

  return token;
};
