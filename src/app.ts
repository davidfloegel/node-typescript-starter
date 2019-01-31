import bluebird from 'bluebird';
import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import logger from './util/logger';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';

import * as AuthController from 'controllers/AuthController';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Create express server
const app = express();

// Connect to MongoDB
if (process.env.NODE_ENV !== 'testing') {
  const mongoUrl = MONGODB_URI;
  mongoose.Promise = bluebird;
  mongoose
    .connect(
      mongoUrl,
      { useNewUrlParser: true }
    )
    .then(() => {
      logger.info('Successfully connected to MongoDB');
      app.emit('ready');
    })
    .catch((err: any) => {
      logger.error(
        'MongoDB connection error. Please make sure MongoDB is running. ' + err
      );
      process.exit(1);
    });
} else {
  app.emit('ready');
}

// Configure express
app.set('port', process.env.port || 4000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.get('/', (req, res) => res.status(200).send('Hello'));
app.post('/signup', AuthController.signup);

export default app;
