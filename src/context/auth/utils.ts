import bcrypt from 'bcrypt-nodejs';
import jwt from 'jwt-simple';
import _ from 'lodash';
import config from '../../utils/secrets';

export const hashPassword = (password: string) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export function generateToken(userId: string) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: userId, iat: timestamp }, config.sessionSecret);
}

export function decodeToken(token: string) {
  try {
    const decoded = jwt.decode(token, config.sessionSecret);
    return _.get(decoded, 'sub', null);
  } catch (e) {
    return null;
  }
}
