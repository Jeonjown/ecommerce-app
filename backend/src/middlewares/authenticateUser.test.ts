import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest, authenticateUser } from './authenticateUser';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('authenticateUser', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    process.env.JWT_SECRET = 'SECRETKEY';

    req = {
      cookies: { authToken: 'testtoken' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should attach req.user and call next when token is valid', () => {
    const mockDecoded = { id: 123 };
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

    authenticateUser(req as Request, res as Response, next as NextFunction);

    expect(jwt.verify).toHaveBeenCalledWith('testtoken', 'SECRETKEY');
    expect(req.user).toEqual({ id: 123 });

    expect(next).toHaveBeenCalled();
  });

  it('should throw Error when theres no token ', () => {
    req.cookies = {};
    authenticateUser(req as Request, res as Response, next as NextFunction);

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Not authenticated. No token provided.');
    expect(error.status).toBe(401);
  });

  it('should throw Error when theres no env', () => {
    delete process.env.JWT_SECRET;

    authenticateUser(req as Request, res as Response, next as NextFunction);

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('No JWT secret configured.');

    expect(error.status).toBe(500);
  });

  it('should throw Error when invalid token payload', () => {
    const mockDecoded = { id: 'notanumber' };
    (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

    authenticateUser(req as Request, res as Response, next as NextFunction);

    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Invalid token payload.');

    expect(error.status).toBe(401);
  });
});
