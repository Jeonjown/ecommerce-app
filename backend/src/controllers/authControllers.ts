import { NextFunction, Request, Response } from 'express';

import { loginUser, signupUser } from '../models/authModel';
import { hashPassword } from '../utils/hashPassword';
import { ApiError } from '../utils/ApiError';
import { jwtSign } from '../utils/jwtSign';
import setTokenCookie from '../utils/setTokenCookie';
import { validateEmail } from '../utils/validateEmail';
import validatePassword from '../utils/validatePassword';

export const signupUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new ApiError('Passwords do not match.', 400);
    }

    validateEmail(email);
    validatePassword(password);

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
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError('Please provide all required fields', 400);
    }

    validateEmail(email);

    const user = await loginUser(email, password);

    const token = jwtSign(user.id);

    setTokenCookie(res, token);

    res.status(200).json({ message: 'user successfully logged in ', user });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    res.status(200).json({ message: 'Logged out successfully' });
    return;
  } catch (error) {
    console.error();
    next(new ApiError('Error logging out', 500));
  }
};
