import { Request, Response } from 'express';

import Auth from 'context/auth';

export async function signup(req: Request, res: Response) {
  const s = await Auth.signup(req.body);
  return res.status(200).send({
    user: {
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
    },
  });
}
