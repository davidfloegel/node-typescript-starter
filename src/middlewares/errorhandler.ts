import { NextFunction, Request, Response } from 'express';
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
      data: {
        errors: err.errors || {},
      },
    });

    return next(err);
  }

  res.status(500).send({
    code: 'unknown',
    statusCode: 500,
    error: err.message || 'Internal Server Error',
    data: {
      errors: {},
    },
  });

  return next(err);
}
