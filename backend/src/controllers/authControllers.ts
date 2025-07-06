import { NextFunction, Request, Response } from 'express';
import { validateEmail } from '../utils/validateEmail';
import validatePassword from '../utils/validatePassword';
import { loginUser, signupUser } from '../models/authModel';
import { hashPassword } from '../utils/hashPassword';
import { ApiError } from '../utils/ApiError';
import { jwtSign } from '../utils/jwtSign';
import setTokenCookie from '../utils/setTokenCookie';
import { loginSchema, signupSchema } from '../validation/authSchemas';

export const signupUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const { name, email, password } = result.data;

    const hashPass = await hashPassword(password);
    const user = await signupUser(name, email, hashPass);

    const token = jwtSign(user.id);

    setTokenCookie(res, token);

    res.status(201).json({ message: 'User successfully signed up.', user });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const { email, password } = result.data;

    if (!email || !password) {
      throw new ApiError('Please provide all required fields', 400);
    }

    const user = await loginUser(email, password);

    const token = jwtSign(user.id);

    setTokenCookie(res, token);

    res.status(200).json({ message: 'user successfully logged in ', user });
  } catch (error) {
    next(error);
  }
};
