import { NextFunction, Response } from 'express';

export default function errorHandler(
  err: any,
  _: any,
  res: Response,
  next: NextFunction
) {
  res.status(500).send({ error: err.message || 'Internal Server Error' });
  return next(err);
}
