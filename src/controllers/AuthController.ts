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
