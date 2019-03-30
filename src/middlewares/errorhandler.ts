import { Request, NextFunction, Response } from 'express';
import { ApiError } from 'src/lib/errors';

export default function errorHandler(
  err: ApiError | Error,
  _: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).send({
      code: err.code,
      statusCode: err.statusCode,
      error: err.message,
      errors: err.errors || {},
    });

    return next(err);
  }

  res.status(500).send({
    code: 'unknown',
    statusCode: 500,
    error: err.message || 'Internal Server Error',
    errors: {},
  });

  return next(err);
}
