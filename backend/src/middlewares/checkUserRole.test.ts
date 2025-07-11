import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticateUser';
import { checkUserRole } from './checkUserRole';
import { getUserById } from '../models/userModel';
import { ApiError } from '../utils/ApiError';

jest.mock('../models/userModel', () => ({
  getUserById: jest.fn().mockResolvedValue({
    id: 1,
    name: 'john doe',
    email: 'johndoe@email.com',
    role: 'admin',
    createdAt: '03/03/2022',
  }),
}));

describe('checkUserRole', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: {
        id: 123,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  const allowedRoles = 'admin';
  const middleware = checkUserRole(allowedRoles);

  it('calls next when user role is found successfully', async () => {
    await middleware(req as AuthenticatedRequest, res as Response, next);

    expect(getUserById).toHaveBeenCalledWith(req.user?.id);
    expect(next).toHaveBeenCalled();
  });

  it('should throw error when no req.user', async () => {
    req = {};

    await middleware(req as AuthenticatedRequest, res as Response, next);

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);

    expect(error.message).toBe('No authenticated user found.');
    expect(error.status).toBe(401);
  });

  it('should throw error when no user found', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(null);

    await middleware(req as AuthenticatedRequest, res as Response, next);

    expect(getUserById).toHaveBeenCalledWith(req.user?.id);

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('User not found.');
    expect(error.status).toBe(404);
  });

  it('should throw error when user role is not matched', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce({
      id: 1,
      name: 'john doe',
      email: 'johndoe@email.com',
      role: 'user',
      createdAt: '03/03/2022',
    });

    await middleware(req as AuthenticatedRequest, res as Response, next);

    expect(getUserById).toHaveBeenCalledWith(req.user?.id);

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Forbidden: insufficient permissions.');
    expect(error.status).toBe(403);
  });
});
