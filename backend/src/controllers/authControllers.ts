import { NextFunction, Request, Response } from 'express';
import { validateEmail } from '../utils/validateEmail';
import validatePassword from '../utils/validatePassword';
import { signupUser } from '../models/authModel';
import { hashPassword } from '../utils/hashPassword';
import { ApiError } from '../utils/ApiError';

export const signupUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    validateEmail(email);
    validatePassword(password);

    const hashPass = await hashPassword(password);
    const user = await signupUser(name, email, hashPass);

    res.status(200).json({ message: 'user successsfully signed up.', user });
  } catch (error) {
    next(error);
  }
};
