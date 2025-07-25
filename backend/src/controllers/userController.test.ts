// arrange
jest.mock('../middlewares/authenticateUser', () => ({
  authenticateUser: jest.fn((req, res, next) => {
    req.user = { id: 123 };
    next();
  }),
}));

jest.mock('../models/userModel.ts', () => ({
  getAllUsers: jest.fn().mockResolvedValue([
    {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      role: 'user',
      created_at: '2024-01-01',
    },
  ]),
  createUser: jest.fn().mockResolvedValue({
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    role: 'user',
    created_at: '2024-01-01',
  }),
  getUserByEmail: jest.fn().mockResolvedValue({
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    role: 'user',
    created_at: '2024-01-01',
  }),
  getUserById: jest.fn().mockResolvedValue({
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    role: 'user',
    created_at: '2024-01-01',
  }),
}));

import { NextFunction, Request, Response } from 'express';
import { getAllUsers, createUser, getUserById } from '../models/userModel';
import { ApiError } from '../utils/ApiError';
import {
  getLoggedInUserController,
  getUsersController,
} from './userControllers';

// act
describe('getUsersController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should return users successfully', async () => {
    await getUsersController(
      req as Request,
      res as Response,
      next as NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        role: 'user',
        created_at: '2024-01-01',
      },
    ]);
  });

  it('should throw Error when Error occurs', async () => {
    (getAllUsers as jest.Mock).mockRejectedValue(new Error('DB error'));

    await getUsersController(
      req as Request,
      res as Response,
      next as NextFunction
    );

    expect(next).toHaveBeenCalled();
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Failed to fetch users');
    expect(error.status).toBe(500);
  });
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
  };
}

describe('getLoggedInUserController', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        role: 'user',
        created_at: '2024-01-01',
      },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should get logged in user successfully', async () => {
    await getLoggedInUserController(req as Request, res as Response, next);

    expect(getUserById).toHaveBeenCalledWith(req.user?.id);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        role: 'user',
        created_at: '2024-01-01',
      },
      message: 'User successfully fetched.',
    });
  });
});
