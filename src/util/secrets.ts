import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

if (!fs.existsSync('.env')) {
  logger.error('No .env file exists in the root directory of your project');
  process.exit(1);
}

dotenv.config({ path: '.env' });

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production';

export const SESSION_SECRET = process.env.SESSION_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI;

if (!SESSION_SECRET) {
  logger.error('No client secret set. Set SESSION_SECRET in your .env');
  process.exit(1);
}

if (!MONGODB_URI) {
  logger.error('no mongodb connection url set. Set MONGODB_URI in your .env');
  process.exit(1);
}
