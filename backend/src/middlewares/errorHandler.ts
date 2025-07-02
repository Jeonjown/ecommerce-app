import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    errorCode: status,
    errorMessage: message,
    // optionally include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
