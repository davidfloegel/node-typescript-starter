import { Router, Request, Response } from 'express';

import * as AuthController from 'controllers/AuthController';

export default () => {
  const api = Router();

  api.get('/ping', (req: Request, res: Response) =>
    res.status(200).send({ data: 'pong' })
  );
  api.post('/signup', AuthController.signup);
  api.post('/signin', AuthController.signin);
  api.post('/recover-account', AuthController.recoverAccount);
  api.post('/reset-password', AuthController.resetPassword);
  api.put('/confirm-account', AuthController.confirmAccount);

  return api;
};
