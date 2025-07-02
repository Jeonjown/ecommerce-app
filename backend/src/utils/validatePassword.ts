import validator from 'validator';
import { ApiError } from './ApiError';

const validatePassword = (password: string): boolean => {
  const isValid = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  if (!isValid) {
    throw new ApiError(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.',
      400
    );
  }

  return true;
};

export default validatePassword;
