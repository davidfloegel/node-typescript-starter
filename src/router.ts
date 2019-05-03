import { Request, Response, Router } from 'express';
import passport from 'passport';

import 'thirdparty/passport';

import * as AuthController from 'controllers/AuthController';

const auth = passport.authenticate('jwt', { session: false });

export default () => {
  const api = Router();

  api.get('/ping', (req: Request, res: Response) =>
    res.status(200).send({ data: 'pong' })
  );

  /**
   * Authentication Routes
   */
  api.post('/signup', AuthController.signup);
  api.post('/signin', AuthController.signin);
  api.post('/recover-account', AuthController.recoverAccount);
  api.post('/reset-password', AuthController.resetPassword);
  api.put('/confirm-account', AuthController.confirmAccount);

  /**
   * Demo Secret Route
   */
  api.get('/secret', auth, AuthController.privateRoute);

  return api;
};
