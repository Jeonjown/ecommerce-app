import { NextFunction, Request, Response } from 'express';
import { validateEmail } from '../utils/validateEmail';
import validatePassword from '../utils/validatePassword';
import { loginUser, signupUser } from '../models/authModel';
import { hashPassword } from '../utils/hashPassword';
import { ApiError } from '../utils/ApiError';
import { jwtSign } from '../utils/jwtSign';

export const signupUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError('Please provide all required fields', 400);
    }

    validateEmail(email);
    validatePassword(password);

    const hashPass = await hashPassword(password);
    const user = await signupUser(name, email, hashPass);

    res.status(200).json({ message: 'user successsfully signed up.', user });
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

    const user = await loginUser(email, password);

    const token = jwtSign(user.id);

    res
      .status(200)
      .json({ message: 'user successfully logged in ', user, token });
  } catch (error) {
    next(error);
  }
};
