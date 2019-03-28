import bluebird from 'bluebird';
import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import logger from './util/logger';
import { ENV, PORT, MONGODB_URI, SESSION_SECRET } from './util/secrets';

import * as AuthController from 'controllers/AuthController';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Create express server
const app = express();

// Connect to MongoDB
if (ENV !== 'testing') {
  const mongoUrl = MONGODB_URI;
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
        '❗️MongoDB connection error. Please make sure MongoDB is running. ' +
          err
      );
      process.exit(1);
    });
} else {
  app.emit('ready');
}

// Configure express
app.set('port', PORT || 4000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.get('/ping', (req: Request, res: Response) =>
  res.status(200).send({ data: 'pong' })
);
app.post('/signup', AuthController.signup);

export default app;
