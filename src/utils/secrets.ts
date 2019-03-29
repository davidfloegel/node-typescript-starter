import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

if (!fs.existsSync('.env')) {
  logger.error('No .env file exists in the root directory of your project');
  process.exit(1);
}

dotenv.config({ path: '.env' });

const ENV = process.env.NODE_ENV;
const DEV = ENV === 'development';
const PROD = ENV === 'production';

const PORT = process.env.PORT || 4000;

const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const SENDGRID_USER = process.env.SENDGRID_USER;
const SENDGRID_PASSWORD = process.env.SENDGRID_PASSWORD;

if (!SESSION_SECRET) {
  logger.error('❗️No client secret set. Set SESSION_SECRET in your .env');
  process.exit(1);
}

if (!MONGODB_URI) {
  logger.error(
    '❗️No mongodb connection url set. Set MONGODB_URI in your .env'
  );
  process.exit(1);
}

type Config = {
  env: string;
  dev: boolean;
  prod: boolean;

  port: string;

  sessionSecret: string;
  mongodbURI: string;

  sendgrid: {
    user: string;
    password: string;
  };
};

const config: Config = {
  env: ENV,
  dev: DEV,
  prod: PROD,

  port: String(PORT),

  sessionSecret: SESSION_SECRET,
  mongodbURI: MONGODB_URI,

  sendgrid: {
    user: SENDGRID_USER,
    password: SENDGRID_PASSWORD,
  },
};

export default config;
