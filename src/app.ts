import bluebird from 'bluebird';
import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import * as AuthController from 'controllers/AuthController';
import logger from 'utils/logger';
import secrets from 'utils/secrets';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Create express server
const app = express();

// // Connect to MongoDB if it's not unit testing
// if (secrets.env !== 'unittest') {
const mongoUrl = secrets.mongodbURI;
mongoose.Promise = bluebird;
mongoose
  .connect(
    mongoUrl,
    { useCreateIndex: true, useNewUrlParser: true }
  )
  .then(() => {
    logger.info('💾 Successfully connected to MongoDB');
    app.emit('ready');
  })
  .catch((err: any) => {
    logger.error(
      '❗️MongoDB connection error. Please make sure MongoDB is running. ' + err
    );
    process.exit(1);
  });
// } else {
//   app.emit('ready');
// }

// Configure express
app.set('port', secrets.port);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.get('/ping', (req: Request, res: Response) =>
  res.status(200).send({ data: 'pong' })
);
app.post('/signup', AuthController.signup);
app.post('/signin', AuthController.signin);
app.post('/recover-account', AuthController.recoverAccount);
app.post('/reset-password', AuthController.resetPassword);
app.put('/confirm-account', AuthController.confirmAccount);

export default app;
