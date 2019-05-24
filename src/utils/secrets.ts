import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  if (!fs.existsSync('.env')) {
    logger.error('No .env file exists in the root directory of your project');
    process.exit(1);
  }

  dotenv.config({ path: '.env' });
}

const ENV = process.env.NODE_ENV;

if (!process.env.SESSION_SECRET) {
  logger.error('❗️No client secret set. Set SESSION_SECRET in your .env');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  logger.error(
    '❗️No mongodb connection url set. Set MONGODB_URI in your .env'
  );
  process.exit(1);
}

interface IConfig {
  env: string;
  dev: boolean;
  test: boolean;
  staging: boolean;
  prod: boolean;

  port: string;
  appUrl: string;

  sessionSecret: string;
  mongodbURI: string;

  sendgrid: {
    enabled: boolean;
    catchAll?: string;
    user: string;
    password: string;
  };
}

const enable3rdParty = ENV !== 'test';

const config: IConfig = {
  env: ENV,
  dev: ENV === 'development',
  test: ENV === 'test',
  staging: ENV === 'staging',
  prod: ENV === 'production',

  port: String(process.env.PORT || 4000),
  appUrl: process.env.APP_URL,

  sessionSecret: process.env.SESSION_SECRET,
  mongodbURI: process.env.MONGODB_URI,

  sendgrid: {
    enabled: enable3rdParty,
    catchAll: process.env.SENDGRID_CATCH_ALL,
    user: process.env.SENDGRID_USER,
    password: process.env.SENDGRID_PASSWORD,
  },
};

export default config;
