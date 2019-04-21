import bcrypt from 'bcrypt-nodejs';

import { decodeToken, generateToken, hashPassword } from 'context/auth/utils';

jest.mock('utils/secrets', () => ({ sessionSecret: 'mysecret' }));

describe('Authentication: Utils', () => {
  it('it hashes a given password string', () => {
    bcrypt.genSaltSync = jest.fn();
    jest
      .spyOn(bcrypt, 'genSaltSync')
      .mockImplementation(() => '$2a$10$s2Z.yWoC9AKG8QG.ZekUU.');

    const raw = 'raw-password';
    expect(hashPassword(raw)).toEqual(
      '$2a$10$s2Z.yWoC9AKG8QG.ZekUU.qJkgOrx6qi4tZAPvigfH97VoQb2M6Qi'
    );
  });

  it('it generates a new JWT', () => {
    const token = generateToken('57293');
    expect(token).toBeDefined();
  });

  it('it decodes an existing JWT and return the users id', () => {
    const existingToken = generateToken('12345');

    expect(decodeToken(existingToken)).toEqual('12345');
  });
});
