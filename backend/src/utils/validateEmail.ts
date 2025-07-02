import validator from 'validator';
import { ApiError } from './ApiError';

export const validateEmail = (email: string): boolean => {
  if (!validator.isEmail(email)) {
    throw new ApiError('Email is not valid', 400);
  }
  return true;
};
