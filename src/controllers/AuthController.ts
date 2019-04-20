import { NextFunction, Request, Response } from 'express';
import { generateResponse } from 'utils/response';

import Auth from 'context/auth';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const newUser = await Auth.signup(req.body);

    return res.status(200).send(
      generateResponse({
        message: 'Your account has been created',
        data: {
          user: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
          },
        },
      })
    );
  } catch (e) {
    return next(e);
  }
}

export async function confirmAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const status = await Auth.confirmAccount(req.body.token);

    return res.status(200).send(
      generateResponse({
        message: 'Your account has been verified',
      })
    );
  } catch (e) {
    return next(e);
  }
}

export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const authInfo = await Auth.login(req.body);

    return res.status(200).send(
      generateResponse({
        message: 'Login successful',
        data: authInfo,
      })
    );
  } catch (e) {
    return next(e);
  }
}
