import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './errorHandler';

describe('errorHandler', () => {
  let err: any;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    err = {
      message: 'Something went wrong',
      status: 400,
    };

    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should return a status and message json when it has error', () => {
    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      message: 'Something went wrong',
    });
  });

  it('should default to 500 and Internal Server Error if no status and message', () => {
    err = {}; // empty error object

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Internal Server Error',
    });
  });
});
