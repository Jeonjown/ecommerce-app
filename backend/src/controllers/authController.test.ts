import {
  loginUserController,
  logoutUserController,
  signupUserController,
} from './authControllers';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

import { hashPassword } from '../utils/hashPassword';
import { jwtSign } from '../utils/jwtSign';
import { loginUser, signupUser } from '../models/authModel';
import setTokenCookie from '../utils/setTokenCookie';
import { validateEmail } from '../utils/validateEmail';
import { validatePassword } from '../utils/validatePassword';

jest.mock('../utils/hashPassword', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed-password'),
}));

jest.mock('../utils/jwtSign', () => ({
  jwtSign: jest.fn().mockReturnValue('fake-jwt-token'),
}));

jest.mock('../utils/validateEmail', () => ({
  validateEmail: jest.fn().mockReturnValue(true),
}));

jest.mock('../utils/validatePassword', () => ({
  validatePassword: jest.fn().mockReturnValue(true),
}));

jest.mock('../models/authModel', () => ({
  signupUser: jest.fn().mockResolvedValue({
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
  }),
  loginUser: jest.fn().mockResolvedValue({
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
  }),
}));

jest.mock('../utils/setTokenCookie', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('signupUserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    next = jest.fn();
  });

  it('should sign up user successfully', async () => {
    await signupUserController(req as Request, res as Response, next);

    expect(validateEmail).toHaveBeenCalledWith('john@example.com');
    expect(validatePassword).toHaveBeenCalledWith('Password123!');
    expect(hashPassword).toHaveBeenCalledWith('Password123!');
    expect(signupUser).toHaveBeenCalledWith(
      'John Doe',
      'john@example.com',
      'hashed-password'
    );
    expect(jwtSign).toHaveBeenCalledWith('user123');
    expect(setTokenCookie).toHaveBeenCalledWith(res, 'fake-jwt-token');

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User successfully signed up.',
      user: {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
      },
    });
  });

  it('should throw error when required fields are missing', async () => {
    req.body = {
      name: 'John Doe',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };

    await signupUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();

    const error = (next as jest.Mock).mock.calls[0][0];

    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Please provide all required fields');
    expect((error as ApiError).status).toBe(400);
  });

  it('should throw Error when password are not matched', async () => {
    req.body = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password1234!',
      confirmPassword: 'Password123!',
    };

    await signupUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Passwords do not match.');
    expect(error.status).toBe(400);
  });

  it('should call next when validateEmail throws', async () => {
    (validateEmail as jest.Mock).mockImplementation(() => {
      throw new ApiError('Invalid email', 400);
    });

    await signupUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Invalid email');
    expect(error.status).toBe(400);
  });

  it('should call next when validatePassword throws', async () => {
    (validateEmail as jest.Mock).mockReturnValue(true);

    (validatePassword as jest.Mock).mockImplementation(() => {
      throw new ApiError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.',
        400
      );
    });

    await signupUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
    );
    expect(error.status).toBe(400);
  });
});

describe('loginController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {
        email: 'john@example.com',
        password: 'TestPass123!',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    next = jest.fn();
  });

  it('should login user successfully', async () => {
    await loginUserController(req as Request, res as Response, next);

    expect(validateEmail).toHaveBeenCalledWith(req.body.email);

    expect(jwtSign).toHaveBeenCalledWith('user123');
    expect(setTokenCookie).toHaveBeenCalledWith(res, 'fake-jwt-token');

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'user successfully logged in ',
      user: {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('should throw error when missing field', async () => {
    req.body = {};

    await loginUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Please provide all required fields');
    expect(error.status).toBe(400);
  });

  it('should throw an error when email is not valid', async () => {
    (validateEmail as jest.Mock).mockImplementation(() => {
      throw new ApiError('Email is not valid', 400);
    });

    await loginUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Email is not valid');
    expect(error.status).toBe(400);
  });

  it('should throw an error when user is not found', async () => {
    (validateEmail as jest.Mock).mockImplementation(() => {
      throw new ApiError('Email is not valid', 400);
    });

    await loginUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Email is not valid');
    expect(error.status).toBe(400);
  });

  it('should throw an error when user is not found', async () => {
    (validateEmail as jest.Mock).mockImplementation(() => {
      throw new ApiError('User not found, please sign up first.', 401);
    });

    await loginUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('User not found, please sign up first.');
    expect(error.status).toBe(401);
  });

  it('should throw an error when user is not found', async () => {
    (validateEmail as jest.Mock).mockImplementation(() => {
      throw new ApiError('User not found, please sign up first.', 401);
    });

    await loginUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('User not found, please sign up first.');
    expect(error.status).toBe(401);
  });

  it('should throw an error when password is not match', async () => {
    await loginUserController(req as Request, res as Response, next);
    (loginUser as jest.Mock).mockImplementation(() => {
      throw new ApiError('Invalid credentials', 401);
    });

    expect(next).toHaveBeenCalled();

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('User not found, please sign up first.');
    expect(error.status).toBe(401);
  });
});

describe('logoutUserController ', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return success on logout', async () => {
    await logoutUserController(req as Request, res as Response, next);

    expect(res.clearCookie).toHaveBeenCalledWith('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Logged out successfully',
    });
  });

  it('should call next with ApiError when clearCookie throws', async () => {
    (res.clearCookie as jest.Mock).mockImplementation(() => {
      throw new Error('some internal failure');
    });

    await logoutUserController(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Error logging out');
    expect(error.status).toBe(500);
  });
});
