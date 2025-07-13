import validator from 'validator';
import { ApiError } from './ApiError';

export const validateEmail = (email: string): boolean => {
  if (!validator.isEmail(email)) {
    throw new ApiError('Please enter a valid email.', 400);
  }
  return true;
};
