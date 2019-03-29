import { NextFunction, Response } from 'express';

export default function errorHandler(
  err: any,
  _: any,
  res: Response,
  next: NextFunction
) {
  if (err.statusCode) {
    res.status(err.statusCode).send({
      code: err.code,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || {},
    });

    return next(err);
  }

  res.status(500).send({
    code: 'unknown',
    statusCode: 500,
    message: err.message || 'Internal Server Error',
    errors: {},
  });

  return next(err);
}
