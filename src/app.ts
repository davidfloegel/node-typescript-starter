import bluebird from 'bluebird';
import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import logger from 'utils/logger';
import secrets from 'utils/secrets';
import router from './router';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

// Create express server
const app = express();

// Connect to MongoDb
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

// Configure express
app.set('port', secrets.port);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router());

export default app;
